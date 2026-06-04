const app = require('./app');
const env = require('./config/env');

const server = app.listen(env.port, env.loopBackAddr, () => {
  console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
});

// Prevent EADDRINUSE and other listen failures from crashing silently
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${env.port} is already in use`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});

// Log uncaught sync errors but still exit — the process is in an unknown state
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

// Log unhandled promise rejections (e.g. DB unavailable at startup) but keep
// the HTTP server running so the process stays alive for nodemon / health checks
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const shutdown = (signal) => {
  console.log(`\n${signal} received — shutting down gracefully`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
