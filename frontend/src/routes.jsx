import AppLayout from './components/AppLayout';
import DiyList from './components/DiyList';
import Faq from './components/Faq';
import About from './components/About';
import Blog from './components/Blog';
import Home from './components/Home'; // Import the Home component
import Search from './components/Search';
import DiyDetail from './components/DiyDetail'; // Import the new DiyDetail component
import Login from './components/Login'; // Import Login component
import AdminDashboard from './components/AdminDashboard'; // Import Admin Dashboard
import Cart from './components/Cart'; // Import Cart component
import BirthdayCalendar from './components/BirthdayCalendar'; // Import Birthday Calendar
import NotFound from './components/NotFound'; // Import 404 page


const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />, // Custom 404 page for errors
    children: [
      {
        path: '', // Root path ("/") handled by the Home component
        element: <Home />, // Route for rendering Home component
      },
      {
        path: 'list', // Relative path becomes "/list"
        element: <DiyList />, // Route for displaying DIY list
      },
      {
        path: 'list/:id', // Add route for individual DIY details
        element: <DiyDetail />,
      },
      {
        path: 'faq', // Relative path becomes "/faq"
        element: <Faq />,
      },
      {
        path: 'about', // Relative path becomes "/about"
        element: <About />,
      },
      {
        path: 'blog', // Relative path becomes "/blog"
        element: <Blog />,
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'cart', // Cart page (public)
        element: <Cart />
      },
      {
        path: 'birthdays', // Birthday calendar page
        element: <BirthdayCalendar />
      },
      {
        path: 'login', // Route for admin login
        element: <Login />
      },
      {
        path: 'admin', // Route for admin dashboard (protected)
        element: <AdminDashboard />
      },
      {
        path: '*', // Catch-all route for 404
        element: <NotFound />
      }
    ],
  },
];

export default routes;
