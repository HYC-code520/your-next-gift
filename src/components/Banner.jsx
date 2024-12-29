import { Link } from 'react-router-dom';
import '../styles/Banner.css'; // Make sure the path matches your project structure

function Banner() {
  return (
    <div className="banner">
      <div className="search-icon">
        <Link to="/search">🔍</Link>
      </div>
      <div className="banner-logo">LOGO</div>
    </div>
  );
}

export default Banner;
