module.exports = {
    apps: [
      {
        name: 'ilm-app',
        script: './server/server.js',
        cwd: './server',
        env: {
          PORT: 5001,
          MONGODB_URI: 'mongodb+srv://hmohiuddin:hmohiuddin@msaconnect.buhmxcg.mongodb.net/?retryWrites=true&w=majority&appName=msaconnect',
          JWT_SECRET: 'KS2a12t1Kdy',
          FRONTEND_URL: 'https://ilmplusatucsd.com',
          EMAIL_HOST: 'smtp.ucsd.edu',
          EMAIL_PORT: 587,
          EMAIL_USER: 'noreply@ilmplusatucsd.com',
          EMAIL_PASS: '@Asimhamza#1',
          SENDGRID_API_KEY: ''
        }
      }
    ]
  }