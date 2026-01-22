import { StrictMode } from 'react'; // Provides additional checks and warnings in development
import { createRoot } from 'react-dom/client'; // React DOM rendering entry point
import './index.css'; // Global styles for the app
import routes from './routes.jsx'; // Importing the route configuration
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // React Router utilities
import { AuthProvider } from './context/AuthContext'; // Authentication context
import { CartProvider } from './context/CartContext'; // Cart context
import { ThemeProvider } from './context/ThemeContext'; // Theme context
import { LanguageProvider } from './context/LanguageContext'; // Language context

// Create a router instance using the routes configuration
const router = createBrowserRouter(routes);

// Render the application to the root DOM node
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* Adds an extra layer of error checking during development */}
    <LanguageProvider> {/* Provides language toggle context to the app */}
      <ThemeProvider> {/* Provides theme toggle context to the app */}
        <AuthProvider> {/* Provides authentication context to the app */}
          <CartProvider> {/* Provides cart context to the app */}
    <RouterProvider router={router} /> {/* Provides routing context to the app */}
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </StrictMode>
);
