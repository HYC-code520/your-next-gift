import AppLayout from './components/AppLayout';
import DiyList from './components/DiyList';
import RequestDiyForm from './components/RequestDiyForm';
import Faq from './components/Faq';
import About from './components/About';
import Blog from './components/Blog';
import Home from './components/Home'; // Import the Home component
import Search from './components/Search';


const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <h1>Oops, wrong page!</h1>, // Error page for incorrect URLs
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
        path: 'request-form', // Relative path becomes "/request-form"
        element: <RequestDiyForm />,
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
      }
    ],
  },
];

export default routes;
