import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { Sun, Moon, ShoppingCart, Lock, Search, Languages, LogOut, User, ChevronDown, Menu, X, Bell, HelpCircle } from 'lucide-react';
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
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Fetch pending orders count for admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchPendingOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'pending');

      if (!error && data) {
        setPendingOrdersCount(data.length);
      }
    };

    fetchPendingOrders();

    // Subscribe to realtime changes on orders table
    const subscription = supabase
      .channel('orders-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchPendingOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isAdmin]);

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
          {isAdmin ? (
            <li className="nav-item-desktop">
              <NavLink to="/admin" className="nav-link relative">
                {t('admin')}
                {pendingOrdersCount > 0 && (
                  <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {pendingOrdersCount}
                  </span>
                )}
              </NavLink>
            </li>
          ) : (
            <li className="nav-item-desktop">
              <NavLink to="/faq" className="nav-link">
                {t('faq')}
              </NavLink>
            </li>
          )}

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

          {/* Desktop nav links - right side */}
          <li className="nav-item-desktop">
            <NavLink to="/birthdays" className="nav-link">
              {t('birthdays')}
            </NavLink>
          </li>

          {/* Cart and Menu Icons Container - always visible */}
          <li className="nav-item-icons">
            <div className="flex items-center gap-3">
              {/* Shopping Cart - hidden on mobile, shown in hamburger menu */}
              <NavLink
                to="/cart"
                className="nav-icon-desktop relative text-gray-500 hover:text-primary transition-colors flex items-center justify-center"
                title="View Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Theme Toggle Button - hidden on mobile, shown in hamburger menu */}
              <button
                onClick={toggleTheme}
                className="nav-icon-desktop flex items-center justify-center text-gray-500 hover:text-primary transition-colors p-1"
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
                  className="flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-primary transition-colors p-1"
                  title="Menu"
                >
                  {showHamburgerMenu ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Hamburger Dropdown Menu */}
                {showHamburgerMenu && createPortal(
                  <div
                    className="dropdown-menu fixed w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 z-[99999] dropdown-slide-in py-1.5"
                    style={{ top: menuPosition.top, right: menuPosition.right }}
                  >
                    {/* Navigation */}
                    <div className="mobile-nav-section">
                      <NavLink to="/list" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                        {t('list')}
                      </NavLink>
                      {isAdmin ? (
                        <NavLink to="/admin" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                          {t('admin')}
                          {pendingOrdersCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                              {pendingOrdersCount}
                            </span>
                          )}
                        </NavLink>
                      ) : (
                        <NavLink to="/faq" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                          {t('faq')}
                        </NavLink>
                      )}
                      <NavLink to="/birthdays" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                        {t('birthdays')}
                      </NavLink>
                    </div>

                    {/* Cart (mobile only) */}
                    <div className="mobile-nav-section">
                      <NavLink to="/cart" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {t('cart')}
                        {cartCount > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </NavLink>
                    </div>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                    {/* Account */}
                    {user ? (
                      <>
                        <NavLink to="/profile" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                          <User className="w-3.5 h-3.5" />
                          {t('profile')}
                        </NavLink>
                        {isAdmin && (
                          <NavLink to="/faq" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                            <HelpCircle className="w-3.5 h-3.5" />
                            {t('faq')}
                          </NavLink>
                        )}
                      </>
                    ) : (
                      <NavLink to="/login" className="menu-item" onClick={() => setShowHamburgerMenu(false)}>
                        <User className="w-3.5 h-3.5" />
                        {t('login')}
                      </NavLink>
                    )}

                    <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                    {/* Settings */}
                    <button onClick={() => { toggleTheme(); setShowHamburgerMenu(false); }} className="mobile-nav-section menu-item w-full">
                      {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                      {theme === 'dark' ? 'Light' : 'Dark'}
                    </button>
                    <button onClick={() => { toggleLanguage(); setShowHamburgerMenu(false); }} className="menu-item w-full">
                      <Languages className="w-3.5 h-3.5" />
                      {language === 'en' ? '中文' : 'EN'}
                    </button>

                    {/* Logout */}
                    {user && (
                      <>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                        <button
                          onClick={() => { setShowHamburgerMenu(false); handleSignOut(); }}
                          className="menu-item w-full text-red-500 dark:text-red-400"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          {t('logout')}
                        </button>
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
