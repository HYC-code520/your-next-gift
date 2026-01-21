# 📁 Project Structure

This document provides a complete overview of the Your Next Gift project organization.

## 🌳 Directory Tree

```
your-next-gift/
│
├── frontend/                    # React Application
│   ├── src/
│   │   ├── components/         # React Components
│   │   │   ├── AppLayout.jsx   # Main layout wrapper with routing
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── DiyList.jsx     # Grid view of all projects
│   │   │   ├── DiyCard.jsx     # Individual project card
│   │   │   ├── DiyDetail.jsx   # Project detail page with gallery
│   │   │   ├── Search.jsx      # Search interface with filters
│   │   │   ├── RequestDiyForm.jsx  # Gift request form
│   │   │   ├── Faq.jsx         # FAQ page
│   │   │   ├── About.jsx       # About page
│   │   │   ├── Blog.jsx        # Blog placeholder
│   │   │   ├── NavBar.jsx      # Main navigation
│   │   │   ├── Banner.jsx      # Hero banner
│   │   │   ├── PageBanner.jsx  # Page header component
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   └── AnnouncementBar.jsx  # Top announcement bar
│   │   │
│   │   ├── styles/             # Component Stylesheets
│   │   │   ├── Home.css
│   │   │   ├── DiyList.css
│   │   │   ├── DiyCard.css
│   │   │   ├── DiyDetail.css
│   │   │   ├── Search.css
│   │   │   ├── RequestDiyForm.css
│   │   │   ├── Faq.css
│   │   │   ├── About.css
│   │   │   ├── Blog.css
│   │   │   ├── NavBar.css
│   │   │   ├── Banner.css
│   │   │   ├── PageBanner.css
│   │   │   ├── Footer.css
│   │   │   └── AnnouncementBar.css
│   │   │
│   │   ├── lib/                # Utility Libraries
│   │   │   └── supabaseClient.js   # Supabase configuration
│   │   │
│   │   ├── Image/              # Static Images & Media
│   │   │   ├── logo.png
│   │   │   ├── homepage-image.png
│   │   │   ├── video-home.mp4
│   │   │   ├── Wavy-frame.JPG
│   │   │   ├── Cookie-cusion.JPG
│   │   │   ├── dog-pizza.JPG
│   │   │   ├── Flower-balloon.PNG
│   │   │   ├── Ham-hideout.PNG
│   │   │   ├── magnent.PNG
│   │   │   ├── 7-11.PNG
│   │   │   └── aboutme.png
│   │   │
│   │   ├── routes.jsx          # React Router configuration
│   │   ├── main.jsx            # Application entry point
│   │   ├── App.css             # Global app styles
│   │   └── index.css           # CSS reset & base styles
│   │
│   ├── public/                 # Static Public Assets
│   │   └── vite.svg
│   │
│   ├── node_modules/           # Dependencies (gitignored)
│   │
│   ├── .env.local              # Environment variables (gitignored)
│   ├── .env.example            # Env variable template
│   ├── .gitignore              # Frontend gitignore
│   ├── package.json            # Frontend dependencies
│   ├── package-lock.json       # Dependency lock file
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # ESLint rules
│   ├── index.html              # HTML entry point
│   └── README.md               # Frontend documentation
│
├── backend/                    # Backend Configuration
│   ├── supabase/
│   │   └── schema.sql          # PostgreSQL database schema
│   │
│   └── README.md               # Backend documentation
│
├── docs/                       # Project Documentation
│   ├── QUICK_START.md          # ⭐ Fast setup guide
│   ├── SUPABASE_SETUP.md       # Detailed Supabase setup
│   ├── CHANGES.md              # Migration changelog
│   └── PROJECT_STRUCTURE.md    # This file
│
├── .gitignore                  # Root gitignore
├── README.md                   # Main project README
│
└── [Legacy Files]              # To be removed
    ├── db.json                 # Old json-server data
    ├── json-server             # Old json-server binary
    └── vite-project@0.0.0      # Old build artifact
```

## 📦 Key Files Explained

### Frontend

| File | Purpose | Notes |
|------|---------|-------|
| `main.jsx` | App entry point | Renders React app to DOM |
| `routes.jsx` | Route configuration | All app routes defined here |
| `App.css` | Global app styles | Shared styles across app |
| `index.css` | CSS reset/base | Global CSS variables |
| `vite.config.js` | Vite build config | Build & dev server settings |
| `.env.local` | Environment vars | **Not in git** - add your keys here |
| `.env.example` | Env template | Safe to commit, no secrets |

### Backend

| File | Purpose | Notes |
|------|---------|-------|
| `schema.sql` | Database structure | Run this in Supabase SQL Editor |
| `README.md` | Backend docs | Setup & API documentation |

### Docs

| File | Purpose | Target Audience |
|------|---------|-----------------|
| `QUICK_START.md` | Fast setup guide | New developers |
| `SUPABASE_SETUP.md` | Detailed setup | Step-by-step walkthrough |
| `CHANGES.md` | Migration log | What changed from json-server |
| `PROJECT_STRUCTURE.md` | This file | Understanding the codebase |

## 🔄 Data Flow

```
User Browser
    ↓
React App (frontend/)
    ↓
Supabase Client (lib/supabaseClient.js)
    ↓
Supabase API (cloud-hosted)
    ↓
PostgreSQL Database (schema.sql)
```

## 🎯 Component Hierarchy

```
AppLayout (Layout + Data Fetching)
├── AnnouncementBar
├── Banner
├── NavBar
└── Outlet (Route Content)
    ├── Home
    ├── DiyList
    │   └── DiyCard (×11)
    ├── DiyDetail
    ├── Search
    ├── RequestDiyForm
    ├── Faq
    ├── About
    └── Blog
└── Footer
```

## 📝 Naming Conventions

### Components
- **PascalCase**: `DiyCard.jsx`, `RequestDiyForm.jsx`
- Descriptive names that indicate purpose

### Styles
- **Match component name**: `DiyCard.css` for `DiyCard.jsx`
- **Shared styles**: Prefixed with purpose (e.g., `PageBanner.css`)

### Database Tables
- **snake_case**: `diy_projects`, `request_submissions`
- Plural for collections

### Environment Variables
- **UPPERCASE_SNAKE**: `VITE_SUPABASE_URL`
- Prefixed with `VITE_` for client-side access

## 🚀 Development Workflow

### Working on Frontend
```bash
cd frontend
npm run dev          # Start dev server
npm run lint         # Check code quality
npm run build        # Build for production
```

### Working on Backend (Supabase)
1. Make changes in `backend/supabase/schema.sql`
2. Run SQL in Supabase dashboard
3. Test with frontend
4. Commit changes

### Adding New Features

**New Page:**
1. Create component in `src/components/`
2. Create stylesheet in `src/styles/`
3. Add route in `src/routes.jsx`
4. Add navigation link in `NavBar.jsx`

**New Database Table:**
1. Add SQL to `backend/supabase/schema.sql`
2. Run in Supabase SQL Editor
3. Update Supabase client calls in components
4. Add RLS policies for security

## 📚 Import Path Examples

```javascript
// From a component to another component (same directory)
import DiyCard from './DiyCard';

// From a component to styles (parent directory)
import '../styles/DiyCard.css';

// From a component to lib (parent → sibling directory)
import { supabase } from '../lib/supabaseClient';

// From a component to App.css (parent directory)
import '../App.css';

// From main.jsx to routes
import routes from './routes.jsx';
```

## 🔒 Security & Sensitive Files

### Never Commit:
- ✋ `frontend/.env.local` - Contains API keys
- ✋ `frontend/node_modules/` - Dependencies
- ✋ Any file with actual credentials

### Safe to Commit:
- ✅ `frontend/.env.example` - Template only
- ✅ All source code
- ✅ Configuration files
- ✅ Documentation

## 🎨 Styling Architecture

```
index.css           → CSS reset, global variables, base styles
App.css             → App-wide shared styles
styles/             → Component-specific styles
  ├── Home.css     → Only affects Home component
  ├── DiyList.css  → Only affects DiyList component
  └── ...
```

## 🔍 Finding Things

**Need to find a component?**
→ Look in `frontend/src/components/`

**Need to change styles?**
→ Look in `frontend/src/styles/` (same name as component)

**Need to add/modify data structure?**
→ Look in `backend/supabase/schema.sql`

**Need setup instructions?**
→ Look in `docs/QUICK_START.md`

**Need to understand routing?**
→ Look in `frontend/src/routes.jsx`

**Need to configure Supabase?**
→ Look in `frontend/src/lib/supabaseClient.js`

## 🧹 Cleanup Needed

These files can be safely deleted (but kept for reference):
- `db.json` - Old json-server data (replaced by Supabase)
- `json-server` - Old server binary (no longer needed)
- `vite-project@0.0.0` - Old build artifact

## 📊 Project Stats

- **Components**: 14 React components
- **Routes**: 8 public routes
- **Database Tables**: 2 (diy_projects, request_submissions)
- **DIY Projects**: 11 pre-loaded
- **Lines of Code**: ~2500+ (estimated)

---

**Questions about the structure?** Check the README files in each folder! 📖
