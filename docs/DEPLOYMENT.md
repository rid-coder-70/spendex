# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ database
- Domain names configured
- SSL certificates (for production)

---

## Backend Deployment (Railway/Render/Heroku)

### Option 1: Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL Database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-configure DATABASE_URL

4. **Configure Environment Variables**
```bash 
NODE_ENV=production
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-frontend.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_ENABLED=true
MONTHLY_REPORT_ENABLED=true
```

5. **Configure Build Settings**
   - Root Directory: `/backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

6. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL: `https://your-app.railway.app`

---

### Option 2: Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up

2. **Create PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Copy connection string

3. **Create Web Service**
   - Dashboard → New → Web Service
   - Connect GitHub repository
   - Settings:
     - Name: spendguard-api
     - Region: Choose closest
     - Branch: main
     - Root Directory: backend
     - Runtime: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

4. **Environment Variables**
   - Add all variables from `.env.example`
   - Use Render's internal database URL

5. **Deploy**
   - Click "Create Web Service"

---

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI**
```bash
   npm install -g vercel
```

2. **Login to Vercel**
```bash
   vercel login
```

3. **Deploy from Frontend Directory**
```bash
   cd frontend
   vercel
```

4. **Configure Project**
   - Follow prompts
   - Link to existing project or create new
   - Set root directory to `frontend`

5. **Environment Variables**
   - Dashboard → Settings → Environment Variables
   - Add:
   ```bash
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   NEXT_PUBLIC_APP_NAME=SpendGuard
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

6. **Deploy Production**
```bash
   vercel --prod
```

---

### Option 2: Netlify

1. **Install Netlify CLI**
```bash
   npm install -g netlify-cli
```

2. **Login**
```bash
   netlify login
```

3. **Initialize**
```bash
   cd frontend
   netlify init
```

4. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `.next`

5. **Environment Variables**
   - Dashboard → Site settings → Environment variables
   - Add same variables as Vercel

6. **Deploy**
```bash
   netlify deploy --prod
```

---

## Database Setup

### Run Migrations

1. **Connect to Production Database**
```bash
   psql postgresql://user:password@host:port/dbname
```

2. **Run Schema**
```sql
   \i database/schema.sql
```

3. **Seed Categories**
```sql
   \i database/seeds/categories.sql
```

---

## Post-Deployment Checklist

- [ ] Backend API accessible
- [ ] Frontend loads correctly
- [ ] Database connected
- [ ] Authentication works
- [ ] Email service configured
- [ ] Cron jobs running
- [ ] SSL certificates valid
- [ ] Environment variables set
- [ ] CORS configured correctly
- [ ] Error logging enabled

---

## Monitoring

### Backend Health Check
https://your-backend.railway.app/api/health

### Frontend Health Check
https://your-app.vercel.app

---

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Verify SSL settings
- Ensure database is running

### CORS Errors
- Update FRONTEND_URL in backend
- Check allowed origins

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD
- Check Gmail app password is correct
- Ensure EMAIL_ENABLED=true

### Cron Jobs Not Running
- Check server logs
- Verify MONTHLY_REPORT_ENABLED=true
- Ensure server is running 24/7

---

## Scaling

### Backend
- Increase Railway/Render instance size
- Enable auto-scaling
- Add Redis for caching

### Database
- Upgrade PostgreSQL plan
- Enable read replicas
- Set up automated backups

### Frontend
- Vercel auto-scales
- Enable CDN caching
- Optimize images
