import { Link } from 'react-router-dom';
import '../styles/Banner.css';
import logo from '../Image/logo.png';
import searchIcon from '../Image/search-icon.png'; // Import the search icon

function Banner() {
  return (
    <div className="banner">
      <div className="search-icon">
        <Link to="/search">
          <img src={searchIcon} alt="Search Icon" className="search-icon-image" />
        </Link>
      </div>
      <div className="banner-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </div>
  );
}

export default Banner;
