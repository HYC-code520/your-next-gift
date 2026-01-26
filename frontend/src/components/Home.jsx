import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import '../styles/Home.css'; // Ensure the CSS file path is correct
import videoHome from '../Image/video-home.mp4'; // Import the video

function Home() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Play video once and stop at the last frame
      video.play();
      
      const handleEnded = () => {
        video.pause();
        // Set to last frame
        video.currentTime = video.duration;
      };
      
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <div className="home-container">
      {/* Slideshow Section */}
      <div className="slideshow">
        <video
          ref={videoRef}
          className="slideshow-video"
          src={videoHome}
          muted
          playsInline
        />
        <div className="slide-content">
          <h1>Request your next<br />birthday gift</h1>
          <p>Handmade and crafted with love, just for you!</p>
          
          {/* Button to Gift Gallery */}
          <Link to="/list" className="gift-gallery-btn">
            View Gift Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
