const express = require('express');
const supabase = require('../db/supabase');
const { requireAuth } = require('../middleware/auth');
const cache = require('../services/cache');

const router = express.Router();

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

// GET /api/dashboard
router.get('/', requireAuth, async (req, res) => {
  const { user } = req;
  const cacheKey = `dash_${user.id}`;
  const cached = cache.get(cacheKey);
  if (cached) return res.json(cached);

  const today = new Date().toISOString().split('T')[0];

  let formsQuery = supabase.from('forms').select('id, nom, icon, color, adv_config').neq('statut', 'Supprimé');
  if (!user.isAdmin) {
    const { data: rights } = await supabase
      .from('access_rights')
      .select('form_id, can_view_dashboard')
      .eq('user_id', user.id)
      .eq('can_view_dashboard', true);
    const ids = (rights || []).map(r => r.form_id).filter(Boolean);
    if (!ids.length) return res.json({ kpi: {}, weeklyData: [], todayAgenda: [], monthlyData: [] });
    formsQuery = formsQuery.in('id', ids);
  }

  const { data: forms } = await formsQuery;
  const aptFormIds = (forms || []).filter(f => f.adv_config?.isAppointment).map(f => f.id);

  if (!aptFormIds.length) {
    return res.json({ kpi: { todayConfirmed: 0, pending: 0, avgScore: 0 }, weeklyData: [], todayAgenda: [], monthlyData: [] });
  }

  const { data: entries } = await supabase
    .from('form_entries')
    .select('*')
    .in('form_id', aptFormIds)
    .not('rdv_date', 'is', null);

  const todayConfirmed = (entries || []).filter(e => e.rdv_date === today && e.rdv_status === 'Confirmé').length;
  const pending = (entries || []).filter(e => e.rdv_status === 'En attente').length;
  const scores = (entries || []).map(e => parseFloat(e.score_quiz)).filter(n => !isNaN(n));
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

  // Weekly chart
  const weekDates = getWeekDates();
  const weeklyData = weekDates.map(date => ({
    date,
    confirmed: (entries || []).filter(e => e.rdv_date === date && e.rdv_status === 'Confirmé').length,
    pending: (entries || []).filter(e => e.rdv_date === date && e.rdv_status === 'En attente').length,
  }));

  // Today agenda
  const todayAgenda = (entries || [])
    .filter(e => e.rdv_date === today && e.rdv_status === 'Confirmé')
    .sort((a, b) => (a.rdv_time || '').localeCompare(b.rdv_time || ''));

  // Monthly calendar
  const formsMap = Object.fromEntries((forms || []).map(f => [f.id, f]));
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const monthEntries = (entries || []).filter(e => e.rdv_date >= firstDay && e.rdv_date <= lastDay);
  const monthlyMap = {};
  for (const e of monthEntries) {
    if (!monthlyMap[e.rdv_date]) monthlyMap[e.rdv_date] = { confirmed: 0, pending: 0, forms: {} };
    if (e.rdv_status === 'Confirmé') monthlyMap[e.rdv_date].confirmed++;
    if (e.rdv_status === 'En attente') monthlyMap[e.rdv_date].pending++;
    const f = formsMap[e.form_id];
    if (f) {
      if (!monthlyMap[e.rdv_date].forms[e.form_id]) {
        monthlyMap[e.rdv_date].forms[e.form_id] = { ...f, confirmed: 0, pending: 0 };
      }
      if (e.rdv_status === 'Confirmé') monthlyMap[e.rdv_date].forms[e.form_id].confirmed++;
      if (e.rdv_status === 'En attente') monthlyMap[e.rdv_date].forms[e.form_id].pending++;
    }
  }

  const result = {
    kpi: { todayConfirmed, pending, avgScore: parseFloat(avgScore) },
    weeklyData,
    todayAgenda,
    monthlyData: monthlyMap,
  };

  cache.set(cacheKey, result, 300);
  res.json(result);
});

module.exports = router;
