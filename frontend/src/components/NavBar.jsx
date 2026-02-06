import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Sun, Moon, ShoppingCart, Lock, Search, Languages, LogOut, User, ChevronDown, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import '../styles/NavBar.css';

function NavBar() {
  const { user, isAdmin, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const cartCount = getCartCount();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Calculate dropdown position when menu opens
  useEffect(() => {
    if (showHamburgerMenu && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8, // 8px below the button
        right: window.innerWidth - rect.right
      });
    }
  }, [showHamburgerMenu]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      // Check if click is outside both the button and the dropdown
      const dropdownEl = document.querySelector('.dropdown-menu');
      if (hamburgerRef.current && !hamburgerRef.current.contains(event.target) &&
          (!dropdownEl || !dropdownEl.contains(event.target))) {
        setShowHamburgerMenu(false);
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
    <div className="navbar-wrapper">
      <nav className="navbar">
        <ul className="navbar-links">
          {/* Desktop nav links - hidden on mobile */}
          <li className="nav-item-desktop">
            <NavLink to="/list" className="nav-link">
              {t('list')}
            </NavLink>
          </li>
          <li className="nav-item-desktop">
            <NavLink to="/faq" className="nav-link">
              {t('faq')}
            </NavLink>
          </li>

          {/* Logo - always visible */}
          <li className="nav-item-logo">
            <NavLink to="/" className="nav-link nav-link-arch">
              <svg viewBox="0 0 280 80" className="arch-svg">
                <path id="arch-curve" d="M 10,75 Q 140,10 270,75" fill="transparent" />
                <text className="arch-text-svg">
                  <textPath href="#arch-curve" startOffset="50%" textAnchor="middle">
                    MADE   BY   ARIEL
                  </textPath>
                </text>
              </svg>
            </NavLink>
          </li>

          {/* Desktop nav links - hidden on mobile */}
          <li className="nav-item-desktop">
            <NavLink to="/birthdays" className="nav-link">
              {t('birthdays')}
            </NavLink>
          </li>
          {isAdmin && (
            <li className="nav-item-desktop">
              <NavLink to="/admin" className="nav-link">
                {t('admin')}
              </NavLink>
            </li>
          )}

          {/* Cart and Menu Icons Container - always visible */}
          <li className="nav-item-icons">
            <div className="flex items-center gap-3">
              {/* Shopping Cart */}
              <NavLink
                to="/cart"
                className="relative text-gray-500 hover:text-primary transition-colors flex items-center justify-center"
                title="View Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center text-gray-500 hover:text-primary transition-colors p-1"
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>

              {/* Hamburger Menu Button */}
              <div className="relative" ref={hamburgerRef}>
                <button
                  ref={menuButtonRef}
                  onClick={() => setShowHamburgerMenu(!showHamburgerMenu)}
                  className="flex items-center justify-center text-gray-500 hover:text-primary transition-colors p-1"
                  title="Menu"
                >
                  {showHamburgerMenu ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Hamburger Dropdown Menu - rendered via portal to avoid z-index issues */}
                {showHamburgerMenu && createPortal(
                  <div
                    className="dropdown-menu fixed w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-[99999]"
                    style={{ top: menuPosition.top, right: menuPosition.right }}
                  >

                    {/* Mobile Navigation Links - only show on mobile */}
                    <div className="mobile-nav-section py-1 border-b border-gray-200 dark:border-gray-700">
                      <NavLink
                        to="/list"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        {t('list')}
                      </NavLink>
                      <NavLink
                        to="/faq"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        {t('faq')}
                      </NavLink>
                      <NavLink
                        to="/birthdays"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowHamburgerMenu(false)}
                      >
                        {t('birthdays')}
                      </NavLink>
                    </div>

                    {/* User Section */}
                    {user ? (
                      <>
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate mb-0.5">
                            {user.email}
                          </p>
                          {isAdmin && (
                            <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                              Admin
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <NavLink
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowHamburgerMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            {t('profile')}
                          </NavLink>
                          <NavLink
                            to="/my-orders"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowHamburgerMenu(false)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {t('myOrders')}
                          </NavLink>
                          {isAdmin && (
                            <NavLink
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              onClick={() => setShowHamburgerMenu(false)}
                            >
                              <Lock className="w-4 h-4" />
                              {t('admin')}
                            </NavLink>
                          )}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      </>
                    ) : (
                      <>
                        <div className="py-1">
                          <NavLink
                            to="/login"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setShowHamburgerMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            {t('login')}
                          </NavLink>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                      </>
                    )}

                    {/* Language Toggle */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          toggleLanguage();
                          setShowHamburgerMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="flex items-center gap-2.5">
                          <Languages className="w-4 h-4" />
                          {t('language')}
                        </span>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {language === 'en' ? '中文' : 'EN'}
                        </span>
                      </button>
                    </div>

                    {/* Logout Button */}
                    {user && (
                      <>
                        <div className="border-t border-gray-200 dark:border-gray-700"></div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowHamburgerMenu(false);
                              handleSignOut();
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            {t('logout')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
