const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { success, error } = require('./utils/response');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Standard middleware chain (spec: helmet → cors → morgan → express.json → routes → 404 → error)
app.use(helmet());
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Local file uploads (fallback when Cloudinary is not configured) ───────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/v1/health', (req, res) => {
  success(res, 'Backend is running', { status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth',        require('./modules/auth/auth.routes'));
app.use('/api/v1/users',       require('./modules/users/users.routes'));
app.use('/api/v1/departments', require('./modules/departments/departments.routes'));
app.use('/api/v1/files',       require('./modules/files/files.routes'));
app.use('/api/v1/faculty',    require('./modules/faculty/faculty.routes'));
app.use('/api/v1/notices',   require('./modules/notices/notices.routes'));
app.use('/api/v1/downloads', require('./modules/downloads/downloads.routes'));
app.use('/api/v1/events',    require('./modules/events/events.routes'));
app.use('/api/v1/gallery',   require('./modules/gallery/gallery.routes'));
app.use('/api/v1/pages',     require('./modules/pages/pages.routes'));
app.use('/api/v1/exam',      require('./modules/exam/exam.routes'));
app.use('/api/v1/placement', require('./modules/placement/placement.routes'));
app.use('/api/v1/audit-logs', require('./modules/audit/audit.routes'));

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  error(res, 'Route not found', `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// ── Centralized error handler (must be last) ──────────────────────────────────

app.use(errorMiddleware);

module.exports = app;
