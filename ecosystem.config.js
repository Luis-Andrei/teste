module.exports = {
    apps: [{
        name: 'dashboard',
        script: 'server.js',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
            NODE_ENV: 'development',
            PORT: 8080,
            HOST: '0.0.0.0'
        },
        error_file: 'logs/err.log',
        out_file: 'logs/out.log',
        log_file: 'logs/combined.log',
        time: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        merge_logs: true,
        max_restarts: 10,
        restart_delay: 5000,
        exp_backoff_restart_delay: 100,
        listen_timeout: 10000,
        kill_timeout: 3000,
        wait_ready: true
    }]
}; 