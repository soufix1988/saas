const express = require('express');
const supabase = require('../db/supabase');
const { requireAdmin } = require('../middleware/auth');
const cache = require('../services/cache');

const router = express.Router();

// GET /api/users
router.get('/', requireAdmin, async (req, res) => {
  const { data, error } = await supabase.from('saas_users').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// POST /api/users
router.post('/', requireAdmin, async (req, res) => {
  const { nom, prenom, password, email } = req.body;
  const count = await supabase.from('saas_users').select('id', { count: 'exact' });
  const num = String((count.count || 0) + 1).padStart(4, '0');
  const id = `USR-${num}`;
  const { data, error } = await supabase
    .from('saas_users')
    .insert({ id, nom, prenom, password, email })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/users/:id
router.delete('/:id', requireAdmin, async (req, res) => {
  await supabase.from('access_rights').delete().eq('user_id', req.params.id);
  await supabase.from('saas_users').delete().eq('id', req.params.id);
  cache.del(`user_ctx_${req.params.id}`);
  res.json({ success: true });
});

// GET /api/users/access
router.get('/access', requireAdmin, async (req, res) => {
  const { data: rights } = await supabase.from('access_rights').select('*').order('user_id');
  const { data: users } = await supabase.from('saas_users').select('id, nom, prenom, email');
  const { data: forms } = await supabase.from('forms').select('id, nom').neq('statut', 'Supprimé');
  res.json({ rights: rights || [], users: users || [], forms: forms || [] });
});

// POST /api/users/access
router.post('/access', requireAdmin, async (req, res) => {
  const { user_id, form_id, can_view, can_edit, can_delete, can_view_dashboard } = req.body;
  const { error } = await supabase
    .from('access_rights')
    .upsert({ user_id, form_id, can_view, can_edit, can_delete, can_view_dashboard }, { onConflict: 'user_id,form_id' });
  if (error) return res.status(500).json({ error: error.message });
  cache.del(`user_ctx_${user_id}`);
  res.json({ success: true });
});

// DELETE /api/users/access/:id
router.delete('/access/:id', requireAdmin, async (req, res) => {
  await supabase.from('access_rights').delete().eq('id', req.params.id);
  res.json({ success: true });
});

module.exports = router;
