import { StrictMode } from 'react'; // Provides additional checks and warnings in development
import { createRoot } from 'react-dom/client'; // React DOM rendering entry point
import './index.css'; // Global styles for the app
import routes from './routes.jsx'; // Importing the route configuration
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // React Router utilities

// Create a router instance using the routes configuration
const router = createBrowserRouter(routes);

// Render the application to the root DOM node
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* Adds an extra layer of error checking during development */}
    <RouterProvider router={router} /> {/* Provides routing context to the app */}
  </StrictMode>
);
