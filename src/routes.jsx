import AppLayout from './components/AppLayout';
import DiyList from './components/DiyList';
import DiyForm from './components/DiyForm';

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <h1>Oops, wrong page!</h1>, // Error page for incorrect URLs
    children: [
      {
        path: '', 
        element: <DiyList />, // Route for displaying DIY list
      },
      {
        path: '/add-diy', 
        element: <DiyForm />, // Route for adding new DIY projects
      },
    ],
  },
];

export default routes;
