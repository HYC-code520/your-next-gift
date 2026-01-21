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
      <div className="home-container">
        <NavLink to="/" className="home-link">
          {t('home')}
        </NavLink>
      </div>
      
      <ul className="navbar-links">
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

      <div className="search-container">
        <button 
          onClick={toggleLanguage} 
          className="language-toggle-btn"
          aria-label="Toggle language"
          title={language === 'en' ? 'Switch to Chinese' : '切换到英文'}
        >
          <Languages className="w-5 h-5" />
          <span className="language-text">{language === 'en' ? '中文' : 'EN'}</span>
        </button>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
        <NavLink to="/cart" className="cart-nav-link">
          <ShoppingCart className="w-7 h-7" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
        <NavLink to="/search" className="search-nav-link">
          <Search className="w-9 h-9" />
        </NavLink>
        {!user && (
          <NavLink to="/login" className="login-nav-link">
            <Lock className="w-6 h-6" />
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
