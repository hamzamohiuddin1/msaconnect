# MSAConnect Deployment Guide

This guide will help you deploy MSAConnect to various hosting platforms.

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - Recommended for Beginners

**Frontend (Vercel):**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Import your repository
4. Set the root directory to `client`
5. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`
6. Deploy!

**Backend (Railway):**
1. Go to [railway.app](https://railway.app) and sign up
2. Create new project → Deploy from GitHub
3. Select your repository
4. Set the root directory to `server`
5. Add environment variables:
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://your-mongodb-atlas-connection
   JWT_SECRET=your-secret-key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. Deploy!

### Option 2: Netlify (Frontend) + Heroku (Backend)

**Frontend (Netlify):**
1. Build the frontend: `cd client && npm run build`
2. Drag and drop the `build` folder to [netlify.com](https://netlify.com)
3. Or connect your GitHub repo and set build command: `cd client && npm run build`
4. Set publish directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL=https://your-app.herokuapp.com/api`

**Backend (Heroku):**
1. Install Heroku CLI
2. Create `Procfile` in server directory: `web: node server.js`
3. Commands:
   ```bash
   cd server
   heroku create your-app-name
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set FRONTEND_URL=https://your-netlify-app.netlify.app
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

### Option 3: DigitalOcean App Platform (Full Stack)

1. Create account at [digitalocean.com](https://digitalocean.com)
2. Go to App Platform
3. Connect GitHub repository
4. Configure:
   - **Backend Service:**
     - Source: `/server`
     - Build command: `npm install`
     - Run command: `npm start`
     - Port: 5001
   - **Frontend Service:**
     - Source: `/client`
     - Build command: `npm run build`
     - Output directory: `build`
5. Add environment variables for backend
6. Deploy!

## Database Setup (MongoDB Atlas)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Use connection string as `MONGODB_URI`

## Environment Variables Checklist

**Backend (.env):**
```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/msaconnect
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend (.env or platform environment variables):**
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## Email Configuration

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use Gmail address as EMAIL_USER
4. Use App Password as EMAIL_PASS

**Alternative Email Services:**
- **SendGrid:** More reliable for production
- **Mailgun:** Good for transactional emails
- **AWS SES:** Cost-effective for high volume

## Security Considerations

1. **JWT Secret:** Use a long, random string (32+ characters)
2. **CORS:** Configure properly for your domain
3. **Rate Limiting:** Add rate limiting to prevent abuse
4. **HTTPS:** Ensure both frontend and backend use HTTPS
5. **Environment Variables:** Never commit secrets to git

## Production Optimizations

**Backend:**
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

**Frontend:**
- Enable service worker for caching
- Optimize images and assets
- Use React.memo for performance
- Implement error boundaries

## Monitoring and Maintenance

1. **Error Tracking:** Add Sentry or similar
2. **Analytics:** Add Google Analytics if needed
3. **Uptime Monitoring:** Use UptimeRobot or similar
4. **Database Backups:** Configure automatic backups
5. **Log Management:** Use structured logging

## Troubleshooting Common Issues

**"Cannot connect to database":**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Ensure database user has correct permissions

**"CORS errors":**
- Add your frontend domain to CORS configuration
- Check FRONTEND_URL environment variable

**"Email not sending":**
- Verify Gmail app password
- Check email service configuration
- Test with a simple email first

**"Build failures":**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

## Custom Domain Setup

**Frontend (Vercel/Netlify):**
1. Add custom domain in platform settings
2. Update DNS records as instructed
3. SSL certificate is automatic

**Backend (Railway/Heroku):**
1. Add custom domain in platform settings
2. Update DNS CNAME record
3. Update CORS configuration

## Cost Estimates (Monthly)

**Free Tier:**
- Frontend: Vercel/Netlify (Free)
- Backend: Railway/Heroku (Free tier)
- Database: MongoDB Atlas (Free 512MB)
- **Total: $0/month** (with limitations)

**Production Ready:**
- Frontend: $0 (Vercel Pro if needed: $20)
- Backend: Railway ($5-20), Heroku ($7-25)
- Database: MongoDB Atlas ($9-57)
- **Total: $14-102/month** depending on usage

## Support and Resources

- **MongoDB Atlas:** [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs:** [docs.railway.app](https://docs.railway.app)
- **React Deployment:** [create-react-app.dev/docs/deployment](https://create-react-app.dev/docs/deployment)

Need help? Create an issue in the repository or contact the development team!
