# Deploy to Railway

## Quick Deploy Steps:

### 1. Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Railway

**Option A: Web Interface**
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will auto-detect Next.js

**Option B: Railway CLI**
```bash
railway login
railway init
railway up
```

### 3. Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Database URL will be auto-configured

### 4. Set Environment Variables
In Railway project settings, add:
```
NEXTAUTH_URL=https://your-app.up.railway.app
NEXTAUTH_SECRET=your-secret-here
```

Generate secret:
```bash
openssl rand -base64 32
```

### 5. Deploy & Seed
Railway will automatically:
- Install dependencies
- Generate Prisma client
- Build Next.js
- Push database schema
- Seed with demo data
- Start the application

### 6. Access Your App
Your public URL will be: `https://your-project.up.railway.app`

**Default Login:**
- Admin: `admin@asort.vc` / `asort2026`
- Company: `alex@greenroute.com` / `password123`

---

## Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL addon is added
- Check DATABASE_URL is automatically set

**Build Failures:**
- Check logs in Railway dashboard
- Ensure all dependencies are in package.json

**Prisma Issues:**
```bash
railway run npx prisma db push
railway run npx prisma db:seed
```
