const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db/supabase');
const cache = require('../services/cache');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = () => process.env.JWT_SECRET || 'secret';
const TOKEN_TTL = 60 * 60 * 24; // 24h

function makeToken(payload) {
  return jwt.sign(payload, JWT_SECRET(), { expiresIn: TOKEN_TTL });
}

async function buildUserContext(userId) {
  const cacheKey = `user_ctx_${userId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const { data: user } = await supabase
    .from('saas_users')
    .select('id, email, nom, prenom')
    .eq('id', userId)
    .single();

  const { data: rights } = await supabase
    .from('access_rights')
    .select('*')
    .eq('user_id', userId);

  let isAdmin = userId === 'admin';
  const rightsMap = {};

  if (rights) {
    for (const r of rights) {
      if (r.is_admin) { isAdmin = true; continue; }
      if (r.form_id) {
        rightsMap[r.form_id] = {
          view: r.can_view,
          edit: r.can_edit,
          del: r.can_delete,
          viewDashboard: r.can_view_dashboard,
        };
      }
    }
  }

  const ctx = {
    identifier: userId,
    email: user?.email || '',
    fullName: `${user?.prenom || ''} ${user?.nom || ''}`.trim() || userId,
    isAdmin,
    rights: rightsMap,
  };
  cache.set(cacheKey, ctx, 300); // 5 min TTL
  return ctx;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' });

  const idLower = identifier.toLowerCase().trim();

  const { data: users } = await supabase
    .from('saas_users')
    .select('*')
    .or(`id.ilike.${idLower},email.ilike.${idLower}`);

  if (!users || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

  const user = users[0];
  const passwordMatch = user.password === password || (await bcrypt.compare(password, user.password).catch(() => false));
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const ctx = await buildUserContext(user.id);
  const { data: appConfig } = await supabase.from('app_config').select('*').limit(1).single();

  const token = makeToken({ id: user.id, isAdmin: ctx.isAdmin });
  res.json({ token, user: ctx, appConfig });
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const ctx = await buildUserContext(req.user.id);
  const { data: appConfig } = await supabase.from('app_config').select('*').limit(1).single();
  res.json({ user: ctx, appConfig });
});

// POST /api/auth/logout
router.post('/logout', requireAuth, (req, res) => {
  cache.del(`user_ctx_${req.user.id}`);
  res.json({ success: true });
});

module.exports = router;
module.exports.buildUserContext = buildUserContext;
