# Backend - Your Next Gift

This folder contains all backend-related configuration and database schemas for the Your Next Gift application.

## 📁 Structure

```
backend/
└── supabase/
    ├── schema.sql          # PostgreSQL database schema
    └── README.md           # This file
```

## 🗄️ Database

The application uses **Supabase** (PostgreSQL) as its database and API layer.

### Tables

#### `diy_projects`
Stores all DIY project information that users can browse and request.

**Columns:**
- `id` (SERIAL) - Unique project identifier
- `project_name` (TEXT) - Name of the DIY project
- `description` (TEXT) - Detailed description
- `materials` (TEXT[]) - Array of required materials
- `estimated_time` (TEXT) - How long it takes to make
- `images` (TEXT[]) - Array of image URLs
- `created_at` (TIMESTAMP) - When the project was added

#### `request_submissions`
Stores gift requests submitted by friends.

**Columns:**
- `id` (SERIAL) - Unique request identifier
- `full_name` (TEXT) - Requester's name
- `requested_diy` (TEXT) - Which project they want
- `birthday` (TEXT) - Their birthday (MM/DD format)
- `color_preference` (TEXT) - Preferred colors
- `additional_details` (TEXT) - Custom requests
- `created_at` (TIMESTAMP) - When the request was submitted

## 🔒 Security

Row Level Security (RLS) is enabled on all tables:

### diy_projects
- ✅ **SELECT**: Public read access (anyone can view)
- 🔐 **INSERT/UPDATE**: Authenticated users only (admin features)

### request_submissions
- ✅ **INSERT**: Public access (friends can submit requests)
- 🔐 **SELECT**: Authenticated users only (only you can view requests)

## 🚀 Setup

1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `schema.sql`
4. Run the query
5. Your database is ready with sample data!

## 🔑 API Credentials

Get your credentials from:
**Supabase Dashboard → Settings → API**

You'll need:
- Project URL
- anon/public key

Add these to your frontend `.env.local` file.

## 📊 Accessing Data

### Via Supabase Dashboard
- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **API Docs**: Auto-generated API documentation

### Via Frontend
The frontend uses `@supabase/supabase-js` client to interact with these tables automatically.

## 🔮 Future Enhancements

Potential backend features to add:
- [ ] User authentication (Supabase Auth)
- [ ] File storage for project images (Supabase Storage)
- [ ] Email notifications (Supabase Edge Functions)
- [ ] Real-time updates (Supabase Realtime)
- [ ] Admin API endpoints
- [ ] Analytics tracking

## 🆘 Need Help?

Check out the main docs:
- `/docs/QUICK_START.md` - Fast setup guide
- `/docs/SUPABASE_SETUP.md` - Detailed setup instructions
- `/docs/CHANGES.md` - What changed from json-server

---

**Note**: This is a serverless backend. There's no Express/Node server to run. Supabase handles all API requests automatically! 🎉
