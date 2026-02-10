// module.exports = {
//   apps: [{
//     name: 'dev',
//     script: 'node_modules/next/dist/bin/next',
//     args: 'start',
//     cwd: './',
//     instances: 1,
//     autorestart: true,
//     watch: false,
//     max_memory_restart: '1G',
//     env: {
//       NODE_ENV: 'development',
//       PORT: 3000
//     }
    
//   }]
// }


module.exports = {
  apps: [{
    name: 'dev',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 30000,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}