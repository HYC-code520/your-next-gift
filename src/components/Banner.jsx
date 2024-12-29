import { Link } from 'react-router-dom';
import '../styles/Banner.css';
import logo from '../Image/logo.png';

function Banner() {
  return (
    <div className="banner">
      <div className="search-icon">
        <Link to="/search">🔍</Link>
      </div>
      <div className="banner-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
    </div>
  );
}

export default Banner;
