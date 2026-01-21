# 🚀 Supabase Setup Guide

Follow these steps to get your app connected to Supabase and deployed!

## 📝 Step 1: Create Database Tables in Supabase

1. Go to your Supabase project dashboard: https://app.supabase.com
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `backend/supabase/schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see a success message and your tables will be created with sample data!

## 🔑 Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys" - it's a long string)

## 🔧 Step 3: Add Environment Variables Locally

1. Create a file called `.env.local` in the `frontend/` folder (it's already in .gitignore)
2. Add your credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **IMPORTANT**: Never commit this file to Git! It's already in .gitignore.

## ✅ Step 4: Test Locally

1. Make sure you're in the frontend directory
2. Run the development server:
   ```bash
   cd frontend
   npm run dev
   ```
3. Open http://localhost:5173
4. Test these features:
   - ✅ Browse DIY projects (should load from Supabase)
   - ✅ View project details
   - ✅ Search for projects
   - ✅ Submit a gift request form
5. Check Supabase dashboard → **Table Editor** → `request_submissions` to see your submission!

## 🌐 Step 5: Deploy to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Connected to Supabase backend"
   git push
   ```

2. Go to your Vercel dashboard: https://vercel.com
3. Find your project or import it if needed
4. Go to **Settings** → **General** → Set **Root Directory** to `frontend`
5. Go to **Settings** → **Environment Variables**
6. Add the same two variables:
   - Name: `VITE_SUPABASE_URL` → Value: `https://your-project.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: `your-anon-key-here`
6. Click **Save**
7. Go to **Deployments** → Click the **•••** menu → **Redeploy**

## 🎉 Step 6: Share with Friends!

Your app is now live! Friends can:
- Browse your DIY projects
- Submit birthday gift requests
- Search for specific projects

Only YOU can see the submitted requests by:
- Going to Supabase dashboard
- **Table Editor** → `request_submissions`
- View all submissions with timestamps!

---

## 🔒 Security Notes

- The `anon` key is safe to use in frontend code
- Row Level Security (RLS) is enabled:
  - Anyone can READ projects ✅
  - Anyone can SUBMIT requests ✅
  - Only authenticated users can VIEW requests ✅ (that's you!)
  
---

## 🚨 Troubleshooting

### "Missing Supabase environment variables" error
- Make sure `.env.local` exists and has both variables
- Restart your dev server after creating `.env.local`

### Data not loading
- Check browser console for errors
- Verify your Supabase URL and key are correct
- Make sure you ran the SQL schema in Supabase

### Form submission not working
- Check Network tab in browser DevTools
- Verify RLS policies are enabled in Supabase
- Check Supabase logs for any errors

---

## 📊 View Submitted Requests

To see gift requests from your friends:

**Option 1: Supabase Dashboard**
1. Go to Supabase → Table Editor → `request_submissions`
2. View all submissions

**Option 2: Add an Admin Page (Future Feature)**
- We can add authentication
- Create a protected admin dashboard
- View and manage requests in your app

---

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add authentication (so only you can view requests)
- [ ] Email notifications when someone submits
- [ ] Image upload for DIY projects
- [ ] Favorites system
- [ ] Admin dashboard to manage projects
- [ ] Dark mode toggle

Ready to build more features? Just ask! 🎁
