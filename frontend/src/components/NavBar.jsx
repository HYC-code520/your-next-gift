import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, ShoppingCart, Lock, Search, Languages } from 'lucide-react';
import '../styles/NavBar.css';

function NavBar() {
  const { user } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const cartCount = getCartCount();

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
        <li>
          <NavLink to="/about" className="nav-link">
            {t('about')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className="nav-link">
            {t('blog')}
          </NavLink>
        </li>
        <li>
          <NavLink to="/birthdays" className="nav-link">
            {t('birthdays')}
          </NavLink>
        </li>
        {user && (
          <>
            <li>
              <NavLink to="/my-orders" className="nav-link">
                {t('myOrders')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" className="nav-link admin-link">
                {t('admin')}
              </NavLink>
            </li>
          </>
        )}
      </ul>

      {/* Utility buttons - right side */}
      <div className="flex items-center gap-4">
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          {language === 'en' ? '中文' : 'EN'}
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="text-gray-500 hover:text-primary transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Cart */}
        <NavLink to="/cart" className="relative text-gray-500 hover:text-primary transition-colors">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
