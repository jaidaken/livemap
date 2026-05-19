const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

const JWT_SECRET = process.env.JWT_SECRET;
const ALLOWED_USERS = (process.env.SWMAP_AUTH_ALLOWED_USERS || '').split(',').map(s => s.trim()).filter(Boolean);

if (!JWT_SECRET) {
  console.error('Missing required env: JWT_SECRET');
  process.exit(1);
}

app.set('trust proxy', true);
app.use(cors({
  origin: ['https://swmap.xyz', 'https://www.swmap.xyz'],
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Caddy on edge gates this path with oauth2-proxy forward_auth + Pocket-ID
// passkey. On reach, X-Auth-Request-User identifies the authed Pocket-ID user.
app.get('/auth/issue', (req, res) => {
  const user = req.header('X-Auth-Request-User') || req.header('x-auth-request-user');
  const email = req.header('X-Auth-Request-Email') || req.header('x-auth-request-email');
  if (!user) return res.status(401).json({ error: 'No upstream identity header' });
  if (ALLOWED_USERS.length > 0 && !ALLOWED_USERS.includes(user) && !ALLOWED_USERS.includes(email || '')) {
    return res.status(403).json({ error: 'Not on the allowed list' });
  }
  const token = jwt.sign(
    { role: 'swmap', sub: user, email },
    JWT_SECRET,
    { expiresIn: '24h' },
  );
  res.json({
    access_token: token,
    token_type: 'bearer',
    expires_in: 86400,
    user: { sub: user, email },
  });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on :${PORT} (Pocket-ID forward-auth bridge)`);
});
