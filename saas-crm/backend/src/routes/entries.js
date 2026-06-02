const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth } = require('../middleware/auth');
const { sendAppointmentEmail, extractEmailFromData } = require('../services/email');
const { createCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = require('../services/calendar');
const { sendSlackNotification } = require('../services/slack');

const router = express.Router();

async function getFormAndConfig(formId) {
  const [{ data: form }, { data: appConfig }] = await Promise.all([
    supabase.from('forms').select('*').eq('id', formId).single(),
    supabase.from('app_config').select('*').limit(1).single(),
  ]);
  return { form, appConfig };
}

// GET /api/entries/:formId
router.get('/:formId', requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('form_entries')
    .select('*')
    .eq('form_id', req.params.formId)
    .order('submitted_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/entries/:formId — public submit
router.post('/:formId', async (req, res) => {
  const { rdv_date, rdv_time, data: entryData, user_id } = req.body;
  const { form, appConfig } = await getFormAndConfig(req.params.formId);
  if (!form) return res.status(404).json({ error: 'Form not found' });

  const advCfg = form.adv_config || {};
  const isAppointment = !!advCfg.isAppointment;
  const isDirectValidation = advCfg.aptValidation !== 'manual';

  const rdvStatus = isAppointment ? (isDirectValidation ? 'Confirmé' : 'En attente') : null;

  const { data: entry, error } = await supabase
    .from('form_entries')
    .insert({
      form_id: req.params.formId,
      user_id: user_id || null,
      rdv_date: rdv_date || null,
      rdv_time: rdv_time || null,
      rdv_status: rdvStatus,
      data: entryData || {},
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Auto-log
  await supabase.from('audit_log').insert({
    form_id: req.params.formId,
    user_id: user_id || 'public',
    action: 'submit',
  });

  // Google Calendar + Email
  const clientEmail = extractEmailFromData(entryData);
  const lang = appConfig?.app_lang || 'fr';
  const color = appConfig?.app_color;
  const appName = appConfig?.app_name || 'FormSaaS';

  if (isAppointment && rdv_date && rdv_time) {
    if (isDirectValidation) {
      const calId = await createCalendarEvent({
        summary: `RDV: ${Object.values(entryData || {})[0] || 'Patient'} (${form.nom})`,
        date: rdv_date,
        time: rdv_time,
        duration: advCfg.aptDuration || 30,
      });
      if (calId) {
        await supabase.from('form_entries').update({ gcal_event_id: calId }).eq('id', entry.id);
      }
      if (clientEmail) {
        await sendAppointmentEmail({
          to: clientEmail,
          type: 'confirmed',
          entry,
          formName: form.nom,
          appName,
          lang,
          color,
          customMessage: advCfg.successMessage,
        }).catch(console.error);
      }
    } else {
      if (clientEmail) {
        await sendAppointmentEmail({
          to: clientEmail,
          type: 'pending',
          entry,
          formName: form.nom,
          appName,
          lang,
          color,
        }).catch(console.error);
      }
    }
  }

  // Slack notification
  if (appConfig?.slack_webhook_url) {
    const { data: fields } = await supabase.from('form_fields').select('label').eq('form_id', req.params.formId).order('ordre');
    sendSlackNotification(appConfig.slack_webhook_url, form.nom, entry, fields || []).catch(console.error);
  }

  res.json(entry);
});

// PUT /api/entries/:formId/:id
router.put('/:formId/:id', requireAuth, async (req, res) => {
  const { rdv_date, rdv_time, rdv_status, data: entryData, notify } = req.body;
  const { form, appConfig } = await getFormAndConfig(req.params.formId);

  const { data: existing } = await supabase.from('form_entries').select('*').eq('id', req.params.id).single();

  const updates = {};
  if (rdv_date !== undefined) updates.rdv_date = rdv_date;
  if (rdv_time !== undefined) updates.rdv_time = rdv_time;
  if (rdv_status !== undefined) updates.rdv_status = rdv_status;
  if (entryData !== undefined) updates.data = entryData;

  const { error } = await supabase.from('form_entries').update(updates).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });

  const lang = appConfig?.app_lang || 'fr';
  const appName = appConfig?.app_name || 'FormSaaS';
  const color = appConfig?.app_color;
  const clientEmail = extractEmailFromData(existing?.data);
  const advCfg = form?.adv_config || {};

  // Handle calendar + email on status change
  if (rdv_status && existing) {
    const dateToUse = rdv_date || existing.rdv_date;
    const timeToUse = rdv_time || existing.rdv_time;
    const patientName = Object.values(existing.data || {})[0] || 'Patient';

    if (rdv_status === 'Confirmé' && !existing.gcal_event_id) {
      const calId = await createCalendarEvent({
        summary: `RDV: ${patientName} (${form?.nom || ''})`,
        date: dateToUse,
        time: timeToUse,
        duration: advCfg.aptDuration || 30,
      });
      if (calId) await supabase.from('form_entries').update({ gcal_event_id: calId }).eq('id', req.params.id);
      if (clientEmail && notify !== false) {
        await sendAppointmentEmail({ to: clientEmail, type: 'confirmed', entry: { rdv_date: dateToUse, rdv_time: timeToUse }, formName: form?.nom, appName, lang, color }).catch(console.error);
      }
    } else if (rdv_status === 'Annulé') {
      if (existing.gcal_event_id) await deleteCalendarEvent(existing.gcal_event_id);
      if (clientEmail && notify !== false) {
        await sendAppointmentEmail({ to: clientEmail, type: 'cancelled', entry: existing, formName: form?.nom, appName, lang, color }).catch(console.error);
      }
    }
  }

  // Date/time changed for confirmed appointment
  if ((rdv_date || rdv_time) && existing?.rdv_status === 'Confirmé' && existing?.gcal_event_id) {
    await updateCalendarEvent(existing.gcal_event_id, {
      summary: `RDV: ${Object.values(existing.data || {})[0] || 'Patient'} (${form?.nom || ''})`,
      date: rdv_date || existing.rdv_date,
      time: rdv_time || existing.rdv_time,
      duration: advCfg.aptDuration || 30,
    });
    if (clientEmail && notify !== false) {
      await sendAppointmentEmail({ to: clientEmail, type: 'modified', entry: { rdv_date: rdv_date || existing.rdv_date, rdv_time: rdv_time || existing.rdv_time }, formName: form?.nom, appName, lang, color }).catch(console.error);
    }
  }

  res.json({ success: true });
});

// DELETE /api/entries/:formId/:id
router.delete('/:formId/:id', requireAuth, async (req, res) => {
  const { notify } = req.query;
  const { form, appConfig } = await getFormAndConfig(req.params.formId);
  const { data: entry } = await supabase.from('form_entries').select('*').eq('id', req.params.id).single();

  if (entry?.gcal_event_id) await deleteCalendarEvent(entry.gcal_event_id);

  if (notify === 'true' && entry) {
    const clientEmail = extractEmailFromData(entry.data);
    if (clientEmail) {
      await sendAppointmentEmail({
        to: clientEmail,
        type: 'cancelled',
        entry,
        formName: form?.nom,
        appName: appConfig?.app_name,
        lang: appConfig?.app_lang || 'fr',
        color: appConfig?.app_color,
      }).catch(console.error);
    }
  }

  await supabase.from('form_entries').delete().eq('id', req.params.id);
  res.json({ success: true });
});

// GET /api/entries/:formId/booked-times — for time slot picker
router.get('/:formId/booked-times', async (req, res) => {
  const { date } = req.query;
  const { data } = await supabase
    .from('form_entries')
    .select('rdv_time')
    .eq('form_id', req.params.formId)
    .eq('rdv_date', date)
    .neq('rdv_status', 'Annulé');
  res.json((data || []).map(e => e.rdv_time));
});

module.exports = router;
