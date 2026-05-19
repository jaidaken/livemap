const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

const VALID_EMAIL = process.env.VITE_APP_USER_EMAIL;
const VALID_PASSWORD_HASH = process.env.SWMAP_AUTH_PASSWORD_HASH;
const JWT_SECRET = process.env.JWT_SECRET;

if (!VALID_EMAIL || !VALID_PASSWORD_HASH || !JWT_SECRET) {
  console.error('Missing required env: VITE_APP_USER_EMAIL, SWMAP_AUTH_PASSWORD_HASH, JWT_SECRET');
  process.exit(1);
}

// Per-IP rate-limit: 5 failed attempts per 15min window triggers a 15min lockout.
const RL_WINDOW_MS = 15 * 60 * 1000;
const RL_MAX_FAILS = 5;
const RL_LOCKOUT_MS = 15 * 60 * 1000;
const rateLimits = new Map();

function clientIp(req) {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return xff.split(',')[0].trim();
  return req.ip || 'unknown';
}

function rateLimitState(ip) {
  const entry = rateLimits.get(ip);
  if (!entry) return { allowed: true };
  const now = Date.now();
  if (entry.lockedUntil > now) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000) };
  }
  return { allowed: true };
}

function recordFailure(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || entry.windowStart + RL_WINDOW_MS < now) {
    rateLimits.set(ip, { failures: 1, windowStart: now, lockedUntil: 0 });
    return;
  }
  entry.failures += 1;
  if (entry.failures >= RL_MAX_FAILS) {
    entry.lockedUntil = now + RL_LOCKOUT_MS;
  }
}

function recordSuccess(ip) {
  rateLimits.delete(ip);
}

function timingSafeEqual(a, b) {
  const ab = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab);
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw, 'utf8').digest('hex');
}

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/auth/login', (req, res) => {
  const ip = clientIp(req);
  const rl = rateLimitState(ip);
  if (!rl.allowed) {
    res.set('Retry-After', String(rl.retryAfterSeconds));
    return res.status(429).json({ error: `Too many attempts. Retry in ${rl.retryAfterSeconds}s.` });
  }

  const { email, password } = req.body || {};
  const emailMatch = email && timingSafeEqual(email, VALID_EMAIL);
  const passwordMatch = password && timingSafeEqual(hashPassword(password), VALID_PASSWORD_HASH);

  if (emailMatch && passwordMatch) {
    recordSuccess(ip);
    const token = jwt.sign(
      { role: 'swmap', email },
      JWT_SECRET,
      { expiresIn: '24h' },
    );
    return res.json({
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400,
      user: { email },
    });
  }

  recordFailure(ip);
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
