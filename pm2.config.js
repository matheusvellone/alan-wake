module.exports = {
  apps: [
    {
      name: 'wake on lan',
      exec_mode: 'cluster',
      instances: 1,
      script: './src/index.js',
      cwd: __dirname,
      watch: false,
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      merge_logs: true,
      error_file: './log.log',
      out_file: './log.log',
    },
  ],
}
