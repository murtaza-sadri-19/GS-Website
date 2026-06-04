module.exports = {
  apps: [
    {
      name: 'sgsits-backend',
      script: '/var/www/sgsits/GS-Website/backend/src/server.js',
      // instances: 1 gives accurate rate limiting (in-memory, no Redis)
      // instances: 2 doubles throughput but halves rate-limit accuracy
      // instances: 'max' only if Node is on a dedicated server with Redis rate limiting
      instances: 2,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1024M',

      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },

      error_file: 'logs/pm2-error.log',
      out_file:   'logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
