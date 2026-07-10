require('dotenv').config();

const express = require('express');
const cors = require('cors');

const errorHandler = require('./middleware/errorHandler');
const pool = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Akshar ERP API is running',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: err.message,
    });
  }
});

// ── API Routes ─────────────────────────────────────────────
app.use('/api/employees', require('./routes/employees'));
app.use('/api/lookups', require('./routes/lookups'));
app.use('/api/academic-sessions', require('./routes/academicSessions'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/programmes', require('./routes/programmes'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/course-intake', require('./routes/courseIntake'));
app.use('/api/course-schemes', require('./routes/courseSchemes'));
app.use('/api/subjects', require('./routes/subjects'));

// ── Frontend Routing (Catch-all) ───────────────────────────
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
  }
  res.sendFile(require('path').join(__dirname, 'public', 'index.html'));
});

// ── Global Error Handler ───────────────────────────────────
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nServer is running on port: ${PORT}`);
});