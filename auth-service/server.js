const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Get credentials from environment variables
const VALID_EMAIL = process.env.VITE_APP_USER_EMAIL || 'jamiehewitt@pm.me';
const VALID_PASSWORD = process.env.VITE_APP_USER_PASSWORD || 'Dead-Enders12';
const JWT_SECRET = process.env.JWT_SECRET || 'your-256-bit-secret-change-this-in-production';

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Validate credentials
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    // Create JWT token with postgres role
    const token = jwt.sign(
      {
        role: 'postgres',
        email: email
      },
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      access_token: token,
      token_type: 'bearer',
      expires_in: 86400,
      user: { email }
    });
  } else {
    res.status(401).json({
      error: 'Invalid credentials'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
