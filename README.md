# 🎁 Your Next Gift — A Personalized DIY Wishlist App

**Your Next Gift** is a full-stack React web app for discovering DIY gift projects through a curated gallery with search/filtering and rich detail pages. Users can customize gifts, add them to a cart, and track birthdays in a calendar, with dark/light mode and bilingual support (EN/中文). It includes authentication, role-based access, and an admin dashboard to manage content and incoming requests. Inspired by my passion for crafting gifts for friends, this app brings that idea to life with real user flows and data persistence.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

---

## 📁 Project Structure

```
your-next-gift/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── admin/    # Admin dashboard components
│   │   │   └── ui/       # Reusable UI components
│   │   ├── context/      # Context providers (Auth, Cart, Theme, Language)
│   │   ├── styles/       # Component stylesheets
│   │   ├── lib/          # Supabase client config
│   │   ├── utils/        # Helper functions
│   │   ├── routes.jsx    # Route configuration
│   │   └── main.jsx      # App entry point
│   ├── public/           # Public assets & images
│   ├── package.json      # Frontend dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── vite.config.js    # Vite configuration
│
├── backend/              # Backend configuration
│   ├── supabase/
│   │   ├── schema.sql   # Base database schema
│   │   ├── admin-role-setup-safe.sql
│   │   ├── cart-orders-schema.sql
│   │   ├── birthdays-schema.sql
│   │   └── ... (other SQL migration files)
│   └── README.md        # Backend documentation
│
├── docs/                 # Documentation
│   ├── QUICK_START.md   # ⭐ Start here!
│   ├── SUPABASE_SETUP.md
│   └── ...
│
└── README.md            # This file
```

---

## 💡 Project Inspiration

Before learning to code, I always wanted a site where friends could browse DIY projects I made and choose what they'd love for their birthdays. Now that I can build it myself, this app brings that idea to life—with real components, form submission, and data fetching using React.

---

## ✨ Features

### For Users
- 📄 **Home Page:** Warm intro with video background and easy navigation
- 📋 **Gift Gallery:** Browse all DIY projects with category filtering and search
- 🔎 **Detail Pages:** View full project info with multiple images, materials, time estimates, and customization options
- 🎨 **Gift Customization:** Choose colors (preset + custom), size, personalization text, and special requests
- 🛒 **Shopping Cart:** Add customized gifts to cart with sync to database when logged in
- 🎂 **Birthday Calendar:** Track friends' birthdays with upcoming birthday notifications
- 🌓 **Dark/Light Mode:** Toggle between themes with persistent preference
- 🌍 **Bilingual Support:** Switch between English and 中文 (Traditional Chinese)
- 📨 **Gift Requests:** Submit custom birthday gift requests (legacy feature)
- ❓ **FAQ & About Pages:** Learn about DIY projects and the creator

### For Admins
- 🔐 **Admin Authentication:** Secure login with role-based access control
- 📊 **Admin Dashboard:** View statistics (orders, requests, birthdays, customers, projects)
- 📦 **Order Management:** View and update order status (pending, in progress, completed, cancelled)
- 👥 **Customer Management:** View all registered users and their information
- 🎁 **Project Management:** Add, edit, and delete DIY projects with photos and details
- 🎂 **Birthday Management:** View and manage birthday calendar entries
- 📝 **Request Approvals:** Review and approve/reject additional gift requests

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18.3
- **Routing:** React Router DOM v6
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom CSS
- **UI Components:** Custom component library with Lucide React icons
- **State Management:** React Context API (Auth, Cart, Theme, Language)
- **Hooks:** useState, useEffect, useContext, custom hooks

### Backend
- **Database:** Supabase (PostgreSQL)
- **API:** Supabase Auto-generated REST API
- **Authentication:** Supabase Auth (Email/Password)
- **Row Level Security (RLS):** Implemented on all tables
- **Tables:** diy_projects, profiles, orders, cart_items, carts, birthdays, order_items, request_submissions

### DevOps
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Supabase Cloud
- **Version Control:** Git & GitHub

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
   - Run the following SQL files in your Supabase SQL Editor (in order):
     1. `backend/supabase/schema.sql` (base tables)
     2. `backend/supabase/admin-role-setup-safe.sql` (admin roles & profiles)
     3. `backend/supabase/cart-orders-schema.sql` (cart & orders)
     4. `backend/supabase/birthdays-schema.sql` (birthday calendar)
     5. `backend/supabase/add-customization.sql` (customization support)
     6. `backend/supabase/add-birthday-year-tracking.sql` (birthday year tracking)
     7. `backend/supabase/add-categories.sql` (project categories)

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

### React & Modern Frontend
- React functional components & props
- Context API for global state (Auth, Cart, Theme, Language)
- Custom hooks for reusable logic
- `useState` for managing dynamic form and UI data
- `useEffect` for side effects and data fetching
- React Router v6 with nested routes and protected routes
- Controlled form inputs with validation

### Backend & Database
- Supabase integration (PostgreSQL + REST API + Auth)
- Row Level Security (RLS) policies for data protection
- Database schema design with foreign keys and relationships
- Admin role system with role-based access control
- Real-time data sync between localStorage and database

### UI/UX Design
- Responsive design with Tailwind CSS
- Dark/light theme implementation
- Internationalization (i18n) with bilingual support
- Component-driven design system
- Accessible UI patterns

### Full-Stack Features
- Authentication flow (sign up, sign in, sign out)
- Shopping cart with database persistence
- CRUD operations (Create, Read, Update, Delete)
- Admin dashboard with protected routes
- Environment variable management
- Production deployment workflow

---

## 📂 Main Components

### Layout & Navigation
| Component | Description |
|-----------|-------------|
| `AppLayout.jsx` | Main layout with navigation, data fetching, and outlet for routes |
| `NavBar.jsx` | Navigation bar with cart, theme toggle, language toggle, and user menu |
| `Footer.jsx` | Site footer with links |
| `AnnouncementBar.jsx` | Top announcement banner |

### Pages
| Component | Description |
|-----------|-------------|
| `Home.jsx` | Landing page with video banner and welcome message |
| `DiyList.jsx` | Grid view of all DIY projects with search and category filtering |
| `DiyDetail.jsx` | Detailed project view with image gallery and customization options |
| `Cart.jsx` | Shopping cart with customization summary and checkout flow |
| `BirthdayCalendar.jsx` | Calendar view and list of birthdays with CRUD operations |
| `Login.jsx` | Sign in / Sign up page for authentication |
| `AdminDashboard.jsx` | Admin dashboard with statistics and management tabs |
| `Faq.jsx` | Frequently asked questions |
| `About.jsx` | About the creator and project |
| `NotFound.jsx` | Custom 404 page |

### UI Components
| Component | Description |
|-----------|-------------|
| `DiyCard.jsx` | Individual project card with image, title, and quick info |
| `CategoryFilter.jsx` | Category selection for filtering projects |
| `LoadingState.jsx` | Loading animation component |
| `OrderWindowBanner.jsx` | Banner showing order window information |

### Admin Components
| Component | Description |
|-----------|-------------|
| `OrdersManager.jsx` | View and manage all orders |
| `CustomersManager.jsx` | View all customers and their profiles |
| `BirthdaysManager.jsx` | Manage birthday calendar entries |
| `ProjectsManager.jsx` | Add, edit, and delete DIY projects |
| `AdditionalRequestsManager.jsx` | Approve/reject additional gift requests |

### Context Providers
| Context | Description |
|---------|-------------|
| `AuthContext.jsx` | Authentication state and methods (sign in, sign out, admin check) |
| `CartContext.jsx` | Shopping cart state with localStorage and database sync |
| `ThemeContext.jsx` | Dark/light mode toggle with persistent preference |
| `LanguageContext.jsx` | Bilingual support with EN/中文 translations |

---

## 🗺 Future Features

- 📧 Email notifications for new orders and requests
- 💳 Payment integration for gift contributions
- ⭐ Favorites/wishlist system for users
- 🧠 AI-based gift suggestions based on preferences and emotional tone
- 🖼 **Room Preview Tool:** AR-style visualization of projects in rooms
- 📱 Mobile app version (React Native)
- 📦 Order tracking with status updates
- 📸 User-uploaded project photos
- 💬 Comments and reviews on projects
- 🎯 Personalized recommendations based on browsing history

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
