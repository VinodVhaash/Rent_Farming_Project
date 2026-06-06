const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { getPool } = require('./config/db');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing Middleware ────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files (uploads) ──────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api', routes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rent Farming API is running' });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
(async () => {
  try {
    await getPool();
    console.log('🎉 Database Connected Successfully');

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database Connection Failed');
    console.error(err.message);
    process.exit(1);
  }
})();

module.exports = app;
