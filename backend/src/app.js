const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const { success, error } = require('./utils/response');
const { withRequestContext } = require('./utils/requestContext');
const errorMiddleware = require('./middlewares/error.middleware');
const { apiLimiter } = require('./middlewares/rateLimit.middleware');
const pool = require('./config/db');

const app = express();

// Behind a reverse proxy (nginx etc.) so rate-limit / IP detection works correctly
app.set('trust proxy', 1);

app.use(helmet({
  frameguard: false,
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(withRequestContext);

// Global API rate limiter (auth + public writes get stricter limiters at the route level)
app.use('/api/', apiLimiter);

// ── Local file uploads (fallback when Cloudinary is not configured) ───────────
// Cross-Origin-Resource-Policy must be cross-origin so the React dev server
// (different port) can load images without ERR_BLOCKED_BY_RESPONSE.NotSameOrigin
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, '../uploads')));

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

// ── Phase-2 additions ────────────────────────────────────────────────────────
app.use('/api/v1/news',      require('./modules/news/news.routes'));
app.use('/api/v1/tenders',   require('./modules/tenders/tenders.routes'));
app.use('/api/v1/alerts',    require('./modules/alerts/alerts.routes'));
app.use('/api/v1/settings',  require('./modules/settings/settings.routes'));
// Academic = sessions + courses + sections + subjects + students + marks + ATKT + correction-requests + electives
app.use('/api/v1/academic',  require('./modules/academic/academic.routes'));

// ── Phase-3 additions: department operations (HOD + Teacher portals) ──────────
app.use('/api/v1/leaves',                require('./modules/leaves/leaves.routes'));
app.use('/api/v1/dept-subjects',         require('./modules/deptSubjects/deptSubjects.routes'));
app.use('/api/v1/timetables',            require('./modules/timetables/timetables.routes'));
app.use('/api/v1/labs',                  require('./modules/labs/labs.routes'));
app.use('/api/v1/achievements',          require('./modules/achievements/achievements.routes'));
app.use('/api/v1/registration-requests', require('./modules/registration/registration.routes'));

// ── Phase-5 additions: global systems ─────────────────────────────────────────
app.use('/api/v1/navigation',    require('./modules/navigation/navigation.routes'));
app.use('/api/v1/seo',           require('./modules/seo/seo.routes'));
app.use('/api/v1/contact',       require('./modules/contact/contact.routes'));
app.use('/api/v1/analytics',     require('./modules/analytics/analytics.routes'));
app.use('/api/v1/notifications', require('./modules/notifications/notifications.routes'));
app.use('/api/v1/chatbot',       require('./modules/chatbot/chatbot.routes'));
app.use('/api/v1/chat',          require('./modules/chat/chat.routes'));     // LangChain + Groq RAG
app.use('/api/v1/search',        require('./modules/search/search.routes'));
app.use('/api/v1/page-sections', require('./modules/page-sections/page-sections.routes'));

// ── Live public stats (consolidated — page-sections/live-stats is the canonical
//    version; this thin alias stays for backwards compat with institutionService)
app.get('/api/v1/stats', async (req, res, next) => {
  try {
    const svc = require('./modules/page-sections/page-sections.service');
    success(res, 'Live stats', await svc.getLiveStats());
  } catch (err) {
    next(err);
  }
});

// ── 404 ───────────────────────────────────────────────────────────────────────

app.use((req, res) => {
  error(res, 'Route not found', `Cannot ${req.method} ${req.originalUrl}`, 404);
});

// ── Centralized error handler (must be last) ──────────────────────────────────

app.use(errorMiddleware);

module.exports = app;
