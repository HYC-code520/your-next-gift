# Frontend - Your Next Gift

React application for the Your Next Gift DIY wishlist platform.

## 🛠️ Tech Stack

- **React** 18.3 - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Supabase JS Client** - Database and API integration
- **ESLint** - Code linting

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   │   ├── AppLayout.jsx  # Main layout with navigation
│   │   ├── Home.jsx       # Landing page
│   │   ├── DiyList.jsx    # Project list view
│   │   ├── DiyCard.jsx    # Project card component
│   │   ├── DiyDetail.jsx  # Project detail page
│   │   ├── Search.jsx     # Search interface
│   │   ├── RequestDiyForm.jsx  # Gift request form
│   │   ├── Faq.jsx        # FAQ page
│   │   ├── About.jsx      # About page
│   │   ├── Blog.jsx       # Blog page
│   │   ├── NavBar.jsx     # Navigation bar
│   │   ├── Banner.jsx     # Banner component
│   │   ├── PageBanner.jsx # Page header banner
│   │   ├── Footer.jsx     # Footer component
│   │   └── AnnouncementBar.jsx  # Top announcement bar
│   │
│   ├── styles/            # CSS stylesheets
│   │   ├── Home.css
│   │   ├── DiyList.css
│   │   ├── DiyCard.css
│   │   ├── DiyDetail.css
│   │   ├── Search.css
│   │   ├── RequestDiyForm.css
│   │   ├── Faq.css
│   │   ├── About.css
│   │   ├── Blog.css
│   │   ├── NavBar.css
│   │   ├── Banner.css
│   │   ├── PageBanner.css
│   │   ├── Footer.css
│   │   └── AnnouncementBar.css
│   │
│   ├── lib/
│   │   └── supabaseClient.js  # Supabase configuration
│   │
│   ├── Image/             # Static images and assets
│   │   ├── logo.png
│   │   ├── homepage-image.png
│   │   ├── video-home.mp4
│   │   └── ...
│   │
│   ├── routes.jsx         # React Router configuration
│   ├── main.jsx           # Application entry point
│   ├── App.css            # Global app styles
│   └── index.css          # Global CSS reset/base styles
│
├── public/                # Static public assets
│   └── vite.svg
│
├── .env.local             # Environment variables (create this!)
├── .env.example           # Environment variable template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── eslint.config.js       # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase project set up (see `/docs/QUICK_START.md`)

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:5173`

## 📜 Available Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build locally
npm run lint      # Run ESLint
```

## 🔌 API Integration

The app connects to Supabase for all data operations:

### Data Fetching (Components)

**AppLayout.jsx** - Fetches all DIY projects on mount and provides via context:
```javascript
const { data, error } = await supabase
  .from('diy_projects')
  .select('*')
  .order('id', { ascending: true });
```

**RequestDiyForm.jsx** - Submits gift requests:
```javascript
const { data, error } = await supabase
  .from('request_submissions')
  .insert([submissionData]);
```

### Supabase Client

Located in `src/lib/supabaseClient.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

## 🎨 Styling

- Custom CSS with component-specific stylesheets
- No CSS frameworks or preprocessors
- Responsive design with media queries
- Modern layout using Flexbox and Grid

## 🧭 Routing

Routes defined in `src/routes.jsx`:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Landing page |
| `/list` | DiyList | Browse all DIY projects |
| `/list/:id` | DiyDetail | View project details |
| `/search` | Search | Search projects |
| `/request-form` | RequestDiyForm | Submit gift request |
| `/faq` | Faq | Frequently asked questions |
| `/about` | About | About page |
| `/blog` | Blog | Blog (future) |

## 🔒 Environment Variables

Required in `.env.local`:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ Yes |

**Note**: Vite requires `VITE_` prefix for environment variables to be exposed to the client.

## 🐛 Troubleshooting

### "Missing Supabase environment variables" error
- Ensure `.env.local` exists in the `frontend/` folder
- Check that variables start with `VITE_` prefix
- Restart dev server after creating/modifying `.env.local`

### Data not loading
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure Supabase database is set up (run `backend/supabase/schema.sql`)

### Port already in use
- Vite uses port 5173 by default
- Kill the process or specify a different port:
  ```bash
  npm run dev -- --port 3000
  ```

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `@supabase/supabase-js` - Supabase client

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `eslint` - Linting
- `eslint-plugin-react` - React ESLint rules

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push
   ```

2. **Import in Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Set **Root Directory** to `frontend`

3. **Add Environment Variables**
   - Settings → Environment Variables
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Get your live URL!

### Build Settings for Vercel

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🎯 Future Features

Ideas for enhancement:
- [ ] User authentication (Supabase Auth)
- [ ] Favorites system
- [ ] Dark mode toggle
- [ ] Image upload for custom requests
- [ ] Real-time notifications
- [ ] Progressive Web App (PWA)
- [ ] Internationalization (i18n)

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Supabase Documentation](https://supabase.com/docs)

---

**Ready to develop?** Run `npm run dev` and start coding! 🎨
