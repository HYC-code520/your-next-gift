# 🎁 Your Next Gift — A Personalized DIY Wishlist App

**Your Next Gift** is a full-stack React application that helps friends and loved ones browse, request, and suggest handmade DIY presents. Inspired by my passion for crafting gifts for friends, this app is a personal twist on the concept of Shopify—intimate, creative, and made with love.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)

---

## 📁 Project Structure

```
your-next-gift/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── styles/       # CSS stylesheets
│   │   ├── lib/          # Supabase client config
│   │   ├── Image/        # Static images
│   │   └── main.jsx      # App entry point
│   ├── public/           # Public assets
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
├── backend/              # Backend configuration
│   ├── supabase/
│   │   └── schema.sql   # Database schema
│   └── README.md        # Backend documentation
│
├── docs/                 # Documentation
│   ├── QUICK_START.md   # ⭐ Start here!
│   ├── SUPABASE_SETUP.md
│   └── CHANGES.md
│
└── README.md            # This file
```

---

## 💡 Project Inspiration

Before learning to code, I always wanted a site where friends could browse DIY projects I made and choose what they'd love for their birthdays. Now that I can build it myself, this app brings that idea to life—with real components, form submission, and data fetching using React.

---

## ✨ Features

- 📄 **Home Page:** Warm intro with video background and easy navigation
- 📋 **List Page:** Browse all available DIY projects with images and descriptions
- 🔍 **Search Page:** Real-time filtering of projects by name
- 🔎 **Detail Page:** View full info including materials, time estimates, and multiple images
- 📨 **Request Form:** Submit a custom birthday gift request
- ❓ **FAQ Page:** Common questions about DIY projects and customization
- 👩‍🎨 **About Page:** Learn the purpose behind the app and the creator's story

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.3
- **Routing:** React Router DOM
- **Build Tool:** Vite
- **Styling:** Custom CSS
- **State Management:** React Hooks (useState, useEffect)

### Backend
- **Database:** Supabase (PostgreSQL)
- **API:** Supabase Auto-generated REST API
- **Authentication:** Supabase Auth (planned)
- **Storage:** Supabase Storage (planned)

### DevOps
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Supabase Cloud
- **Version Control:** Git

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier is fine!)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-next-gift.git
   cd your-next-gift
   ```

2. **Set up the backend**
   - Follow [`docs/QUICK_START.md`](docs/QUICK_START.md) to set up Supabase
   - Run the SQL schema from `backend/supabase/schema.sql`

3. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure environment variables**
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

📚 **Need detailed instructions?** Check [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md)

---

## 🧠 Key Concepts Practiced

- React functional components & props
- `useState` for managing dynamic form and UI data
- `useEffect` for side effects and fetching data
- React Router for routing and nested layouts
- Controlled form inputs and POST request submission
- Modular component-based design
- Supabase integration (PostgreSQL + REST API)
- Environment variable management
- Production deployment workflow

---

## 📂 Main Components

| Component | Description |
|-----------|-------------|
| `AppLayout.jsx` | Main layout with navigation and data fetching |
| `Home.jsx` | Landing page with video banner |
| `DiyList.jsx` | Grid view of all DIY projects |
| `DiyCard.jsx` | Individual project card component |
| `DiyDetail.jsx` | Detailed project view with image gallery |
| `Search.jsx` | Search interface with live filtering |
| `RequestDiyForm.jsx` | Gift request submission form |
| `Faq.jsx` | Frequently asked questions |
| `About.jsx` | About the creator and project |

---

## 🗺 Future Features

- ⭐ Favorites system with user accounts
- 🌒 Light/Dark mode toggle
- 📝 DIY suggestion form on List page
- 🔐 Admin authentication for managing projects
- 📧 Email notifications for new requests
- 🧠 AI-based gift suggestions based on emotional tone
- 🖼 **Room Preview Tool:** AR-style visualization of projects in rooms
- 📱 Mobile app version (React Native)
- 🌍 Multi-language support

---

## 📸 Screenshots

*(Add screenshots of your app here!)*

---

## 🚀 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Backend (Supabase)

Already deployed! Supabase is cloud-hosted and handles everything automatically.

See [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) for detailed deployment instructions.

---

## 📝 License

MIT License - feel free to use this project for your own gift-giving needs!

---

## 🙏 Acknowledgments

- Built with ❤️ for friends and their birthdays
- Inspired by the joy of handmade gifts
- Powered by modern web technologies

---

## 📧 Contact

Questions or want to collaborate? Feel free to reach out!

---

## 🎯 For Developers

### Project Commands

```bash
# Frontend development
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
# No commands needed - Supabase handles everything!
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with 🎁 by a DIY enthusiast turned developer**
