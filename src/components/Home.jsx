import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Ensure the CSS file path is correct

function Home() {
  return (
    <div className="home-container">
      {/* Slideshow Section */}
      <div className="slideshow">
        <img
          src="https://via.placeholder.com/1920x600" // Placeholder image URL
          alt="Slideshow Placeholder"
          className="slideshow-image"
        />
        <div className="slide-content">
          <h1>Welcome to My DIY Project Showcase</h1>
          <p>Explore, request, and learn about my DIY projects!</p>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="home-navigation">
        <Link to="/list" className="nav-item">
          <div className="nav-placeholder">List</div>
        </Link>
        <Link to="/request-form" className="nav-item">
          <div className="nav-placeholder">Form</div>
        </Link>
        <Link to="/faq" className="nav-item">
          <div className="nav-placeholder">FAQ</div>
        </Link>
        <Link to="/about" className="nav-item">
          <div className="nav-placeholder">About</div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
