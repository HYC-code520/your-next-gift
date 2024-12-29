import { Link } from 'react-router-dom';
import '../styles/Home.css'; // If the CSS file is in the `styles` folder


function Home() {
  return (
    <div className="home-section">
      <h1>Welcome to My DIY Project Showcase</h1>
      <p>Explore, request, and learn about my DIY projects!</p>

      {/* Bottom section with clickable items */}
      <div className="home-navigation">
        {/* Link to List Page */}
        <Link to="/list" className="nav-item">
          {/* Placeholder for an image */}
          <div className="nav-placeholder">List</div>
        </Link>

        {/* Link to Request Form Page */}
        <Link to="/request-form" className="nav-item">
          <div className="nav-placeholder">Form</div>
        </Link>

        {/* Link to FAQ Page */}
        <Link to="/faq" className="nav-item">
          <div className="nav-placeholder">FAQ</div>
        </Link>

        {/* Link to About Page */}
        <Link to="/about" className="nav-item">
          <div className="nav-placeholder">About</div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
