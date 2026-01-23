import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, ShoppingCart, Lock, Search, Languages, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import '../styles/NavBar.css';

function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const cartCount = getCartCount();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/'; // Redirect to home after sign out
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <NavLink to="/" className="nav-link">
            {t('home')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/list" className="nav-link">
            {t('list')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/faq" className="nav-link">
            {t('faq')}
          </NavLink>
        </li>
{/* About tab hidden for now
        <li>
          <NavLink to="/about" className="nav-link">
            {t('about')}
          </NavLink>
        </li>
*/}
{/* Blog tab hidden for now
        <li>
          <NavLink to="/blog" className="nav-link">
            {t('blog')}
          </NavLink>
        </li>
*/}
        <li>
          <NavLink to="/birthdays" className="nav-link">
            {t('birthdays')}
          </NavLink>
        </li>
        {isAdmin && (
          <li>
            <NavLink to="/admin" className="nav-link">
              {t('admin')}
            </NavLink>
          </li>
        )}
      </ul>

      {/* Utility buttons - positioned absolutely on the right */}
      <div className="absolute right-8 flex items-center gap-3">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
        >
          {language === 'en' ? '中文' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="text-gray-500 hover:text-primary transition-colors"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* User Menu or Login */}
        {user ? (
          <div className="relative" ref={menuRef}>
            {/* User Avatar Button */}
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors"
              title="Account"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              {isAdmin && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-semibold">
                  Admin
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-primary mt-1">Administrator</p>
                  )}
                </div>
                <NavLink 
                  to="/my-orders" 
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowUserMenu(false)}
                >
                  {t('myOrders')}
                </NavLink>
                {isAdmin && (
                  <NavLink 
                    to="/admin" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    {t('admin')} Dashboard
                  </NavLink>
                )}
                <button 
                  onClick={() => {
                    setShowUserMenu(false);
                    handleSignOut();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign In Button when not logged in */
          <NavLink 
            to="/login" 
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            <User className="w-4 h-4" />
            {t('login')}
          </NavLink>
        )}
      </div>

      {/* Floating Cart Button - Fixed position, always visible */}
      <NavLink 
        to="/cart" 
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="View Cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold border-2 border-white">
            {cartCount}
          </span>
        )}
      </NavLink>
    </nav>
  );
}

export default NavBar;
