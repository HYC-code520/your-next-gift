import { Link } from 'react-router-dom';
import '../styles/Home.css'; // Ensure the CSS file path is correct
import videoHome from '../Image/video-home.mp4'; // Import the video

function Home() {
  return (
    <div className="home-container">
      {/* Slideshow Section */}
      <div className="slideshow">
        <video
          className="slideshow-video"
          src={videoHome}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="slide-content">
          <h1>Request your next birthday gift</h1>
          <p>Handmade and crafted with love, just for you!</p>
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
