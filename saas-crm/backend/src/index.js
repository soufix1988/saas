require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { apiLimiter } = require('./middleware/rateLimit');
const { authLimiter } = require('./middleware/rateLimit');

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    if (allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/forms', require('./routes/forms'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/users', require('./routes/users'));
app.use('/api/config', require('./routes/config'));

app.get('/health', (_, res) => res.json({ ok: true }));

// Export for Vercel serverless
module.exports = app;

// Local dev server
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}
