const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth } = require('../middleware/auth');
const { sendAppointmentEmail, extractEmailFromData } = require('../services/email');
const { createCalendarEvent, deleteCalendarEvent } = require('../services/calendar');

const router = express.Router();

// GET /api/appointments — list all appointments for accessible forms
router.get('/', requireAuth, async (req, res) => {
  const { user } = req;
  const { status, date, formId, search } = req.query;

  let formsQuery = supabase.from('forms').select('id, nom, adv_config, icon, color').neq('statut', 'Supprimé');

  if (!user.isAdmin) {
    const { data: rights } = await supabase
      .from('access_rights')
      .select('form_id')
      .eq('user_id', user.id)
      .eq('can_view', true);
    const ids = (rights || []).map(r => r.form_id).filter(Boolean);
    if (!ids.length) return res.json([]);
    formsQuery = formsQuery.in('id', ids);
  }

  const { data: forms } = await formsQuery;
  const aptFormIds = (forms || [])
    .filter(f => f.adv_config?.isAppointment)
    .map(f => f.id);

  if (!aptFormIds.length) return res.json([]);

  let entriesQuery = supabase
    .from('form_entries')
    .select('*')
    .in('form_id', formId ? [formId] : aptFormIds)
    .not('rdv_date', 'is', null)
    .order('rdv_date', { ascending: false })
    .order('rdv_time', { ascending: true });

  if (status && status !== 'all') entriesQuery = entriesQuery.eq('rdv_status', status);
  if (date) entriesQuery = entriesQuery.eq('rdv_date', date);

  const { data: entries, error } = await entriesQuery;
  if (error) return res.status(500).json({ error: error.message });

  const formsMap = Object.fromEntries((forms || []).map(f => [f.id, f]));
  let result = (entries || []).map(e => ({ ...e, form: formsMap[e.form_id] || null }));

  if (search) {
    const s = search.toLowerCase();
    result = result.filter(e => JSON.stringify(e.data).toLowerCase().includes(s));
  }

  res.json(result);
});

// POST /api/appointments/bulk — bulk actions
router.post('/bulk', requireAuth, async (req, res) => {
  const { ids, action, notify } = req.body;
  if (!ids || !ids.length) return res.status(400).json({ error: 'No ids provided' });

  const { data: entries } = await supabase.from('form_entries').select('*').in('id', ids);
  if (!entries?.length) return res.status(404).json({ error: 'Not found' });

  const { data: appConfig } = await supabase.from('app_config').select('*').limit(1).single();
  const lang = appConfig?.app_lang || 'fr';
  const appName = appConfig?.app_name || 'FormSaaS';
  const color = appConfig?.app_color;

  for (const entry of entries) {
    const { data: form } = await supabase.from('forms').select('*').eq('id', entry.form_id).single();
    const clientEmail = extractEmailFromData(entry.data);
    const advCfg = form?.adv_config || {};

    if (action === 'confirm') {
      await supabase.from('form_entries').update({ rdv_status: 'Confirmé' }).eq('id', entry.id);
      if (!entry.gcal_event_id) {
        const calId = await createCalendarEvent({
          summary: `RDV: ${Object.values(entry.data || {})[0] || 'Patient'} (${form?.nom || ''})`,
          date: entry.rdv_date,
          time: entry.rdv_time,
          duration: advCfg.aptDuration || 30,
        });
        if (calId) await supabase.from('form_entries').update({ gcal_event_id: calId }).eq('id', entry.id);
      }
      if (clientEmail && notify) {
        await sendAppointmentEmail({ to: clientEmail, type: 'confirmed', entry, formName: form?.nom, appName, lang, color }).catch(console.error);
      }
    } else if (action === 'cancel') {
      await supabase.from('form_entries').update({ rdv_status: 'Annulé' }).eq('id', entry.id);
      if (entry.gcal_event_id) await deleteCalendarEvent(entry.gcal_event_id);
      if (clientEmail && notify) {
        await sendAppointmentEmail({ to: clientEmail, type: 'cancelled', entry, formName: form?.nom, appName, lang, color }).catch(console.error);
      }
    } else if (action === 'delete') {
      if (entry.gcal_event_id) await deleteCalendarEvent(entry.gcal_event_id);
      if (clientEmail && notify) {
        await sendAppointmentEmail({ to: clientEmail, type: 'cancelled', entry, formName: form?.nom, appName, lang, color }).catch(console.error);
      }
      await supabase.from('form_entries').delete().eq('id', entry.id);
    }
  }

  res.json({ success: true, count: entries.length });
});

module.exports = router;
