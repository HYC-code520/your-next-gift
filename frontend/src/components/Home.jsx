import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';
import videoHome from '../Image/video-home.mp4';
import bgElement from '../Image/bg element 01.gif';
import bgGrain from '../Image/grain element under text.png';
import bgText from '../Image/bg text.gif';

function Home() {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const isDark = theme === 'dark';

  // Tag body so navbar/footer can go transparent on home page
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  // Light mode: play video once and stop
  useEffect(() => {
    if (isDark) return;
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play();

      const handleEnded = () => {
        video.pause();
        video.currentTime = video.duration;
      };

      video.addEventListener('ended', handleEnded);
      return () => video.removeEventListener('ended', handleEnded);
    }
  }, [isDark]);

  return (
    <div className="home-container">
      {/* Slideshow Section */}
      <div className="slideshow">
        {/* Light mode: video */}
        {!isDark && (
          <video
            ref={videoRef}
            className="slideshow-video"
            src={videoHome}
            muted
            playsInline
          />
        )}

        {/* Dark mode: layered GIFs */}
        {isDark && (
          <div className="slideshow-dark-bg">
            <img
              src={bgElement}
              alt=""
              className="dark-gif dark-gif-element"
            />
            <img
              src={bgGrain}
              alt=""
              className="dark-gif dark-gif-grain"
            />
            <img
              src={bgText}
              alt=""
              className="dark-gif dark-gif-text"
            />
          </div>
        )}

        <div className="slide-content">
          {!isDark && (
            <>
              <h1>Request your next<br />birthday gift</h1>
              <p>Handmade and crafted with love, just for you!</p>
            </>
          )}

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
