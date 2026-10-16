# DLVdispatch – Ready for Vercel + Supabase

Local dispatch platform for Warri & Effurun.

## 1. Create Free Supabase Database (5 minutes)

1. Go to https://supabase.com and sign up (free)
2. Click **New Project**
3. Give it a name (e.g. `dlvdispatch`)
4. Set a strong database password (save it!)
5. Choose a region close to Nigeria (e.g. Frankfurt or London)
6. Wait for the project to be ready (1–2 minutes)

7. Go to **Project Settings → Database**
8. Find **Connection string** → **URI**
9. Copy it and replace `[YOUR-PASSWORD]` with the password you set

Example:
```
postgresql://postgres.xxxxx:yourpassword@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## 2. Setup on Your Computer

```bash
# Extract the project and open in VS Code
npm install

# Create .env file
cp .env.example .env
# Then paste your Supabase DATABASE_URL into the .env file

# Create tables
npx prisma db push

# Add demo accounts
npm run db:seed

# Run locally
npm run dev
```

## 3. Deploy to Vercel

1. Push the project to GitHub (see instructions below)
2. Go to https://vercel.com and login with GitHub
3. Click **Add New Project** → Import your `dlvdispatch` repo
4. In **Environment Variables**, add:
   - Name: `DATABASE_URL`
   - Value: (paste the same Supabase connection string)
5. Click **Deploy**

Done! You will get a live link.

## Demo Accounts (after seeding)

| Role     | Phone       | Password    |
|----------|-------------|-------------|
| Admin    | 08011111111 | admin123    |
| Rider    | 08022222222 | rider123    |
| Customer | 08044444444 | customer123 |

## Push to GitHub (run these on your PC)

```bash
git init
git add .
git commit -m "DLVdispatch ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dlvdispatch.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

**Note:** The current frontend still uses the in-memory store for simplicity.  
Once you confirm the Supabase connection works, I can switch the entire app to use the real database.
