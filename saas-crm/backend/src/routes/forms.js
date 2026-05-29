const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/forms — list accessible forms
router.get('/', requireAuth, async (req, res) => {
  const { user } = req;
  let query = supabase.from('forms').select('*').neq('statut', 'Supprimé').order('created_at', { ascending: false });

  if (!user.isAdmin) {
    const { data: rights } = await supabase
      .from('access_rights')
      .select('form_id')
      .eq('user_id', user.id)
      .eq('can_view', true);
    const formIds = (rights || []).map(r => r.form_id).filter(Boolean);
    if (formIds.length === 0) return res.json([]);
    query = query.in('id', formIds);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// GET /api/forms/public/:id — no auth required
router.get('/public/:id', async (req, res) => {
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', req.params.id)
    .eq('statut', 'Actif')
    .single();
  if (error || !form) return res.status(404).json({ error: 'Form not found' });

  const { data: fields } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', req.params.id)
    .order('ordre');

  const { data: appConfig } = await supabase.from('app_config').select('*').limit(1).single();
  res.json({ form, fields: fields || [], appConfig });
});

// GET /api/forms/:id
router.get('/:id', requireAuth, async (req, res) => {
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', req.params.id)
    .single();
  if (error || !form) return res.status(404).json({ error: 'Form not found' });

  const { data: fields } = await supabase
    .from('form_fields')
    .select('*')
    .eq('form_id', req.params.id)
    .order('ordre');

  res.json({ form, fields: fields || [] });
});

// POST /api/forms
router.post('/', requireAuth, async (req, res) => {
  const { nom, langue, rtl, theme, font, color, text_color, icon, adv_config } = req.body;
  const id = `F_${Date.now()}`;
  const { data, error } = await supabase
    .from('forms')
    .insert({ id, nom, langue, rtl, theme, font, color, text_color, icon, adv_config })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/forms/:id
router.put('/:id', requireAuth, async (req, res) => {
  const { fields, ...formData } = req.body;
  formData.updated_at = new Date().toISOString();

  const { error: formErr } = await supabase.from('forms').update(formData).eq('id', req.params.id);
  if (formErr) return res.status(500).json({ error: formErr.message });

  if (fields) {
    await supabase.from('form_fields').delete().eq('form_id', req.params.id);
    if (fields.length > 0) {
      const rows = fields.map((f, i) => ({ ...f, form_id: req.params.id, ordre: i + 1, id: undefined }));
      await supabase.from('form_fields').insert(rows);
    }
  }

  res.json({ success: true });
});

// DELETE /api/forms/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  await supabase.from('forms').update({ statut: 'Supprimé' }).eq('id', req.params.id);
  res.json({ success: true });
});

// POST /api/forms/:id/duplicate
router.post('/:id/duplicate', requireAuth, async (req, res) => {
  const { data: orig } = await supabase.from('forms').select('*').eq('id', req.params.id).single();
  if (!orig) return res.status(404).json({ error: 'Not found' });

  const newId = `F_${Date.now()}`;
  const { data: newForm } = await supabase
    .from('forms')
    .insert({ ...orig, id: newId, nom: orig.nom + ' (copie)', created_at: undefined, updated_at: undefined })
    .select()
    .single();

  const { data: origFields } = await supabase.from('form_fields').select('*').eq('form_id', req.params.id).order('ordre');
  if (origFields && origFields.length > 0) {
    const newFields = origFields.map(f => ({ ...f, id: undefined, form_id: newId }));
    await supabase.from('form_fields').insert(newFields);
  }

  res.json(newForm);
});

module.exports = router;
