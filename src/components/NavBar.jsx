import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';
import searchIcon from '../Image/search-icon.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="home-container">
        <NavLink to="/" className="home-link">
          HOME
        </NavLink>
      </div>
      
      <ul className="navbar-links">
        <li>
          <NavLink to="/list" className="nav-link">
            LIST
          </NavLink>
        </li>
        <li>
          <NavLink to="/request-form" className="nav-link">
            FORM
          </NavLink>
        </li>
        <li>
          <NavLink to="/faq" className="nav-link">
            FAQ
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-link">
            ABOUT
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className="nav-link">
            BLOG
          </NavLink>
        </li>
      </ul>

      <div className="search-container">
        <NavLink to="/search" className="search-nav-link">
          <img src={searchIcon} alt="Search" className="search-nav-icon" />
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
