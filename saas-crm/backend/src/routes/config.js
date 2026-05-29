const express = require('express');
const supabase = require('../db/supabase');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/config
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('app_config').select('*').limit(1).single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// PUT /api/config
router.put('/', requireAdmin, async (req, res) => {
  const { id, ...updates } = req.body;
  updates.updated_at = new Date().toISOString();
  const { error } = await supabase.from('app_config').update(updates).eq('id', 1);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

module.exports = router;
