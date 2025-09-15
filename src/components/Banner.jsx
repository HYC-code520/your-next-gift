import { Link } from 'react-router-dom';
import '../styles/Banner.css';
import logo from '../Image/logo.png';

function Banner() {
  return (
    <div className="banner">
      <div className="banner-logo">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </div>
    </div>
  );
}

export default Banner;
