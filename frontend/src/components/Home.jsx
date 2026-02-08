import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';
import titleImg from '../Image/Your Next Gift Text.png';

function Home() {
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  return (
    <div className="home-container">
      <div className="slideshow">
        <div className="slide-content">
          <img src={titleImg} alt="Your Next Gift" className="home-title-img" />
          <Link to="/list" className="gift-gallery-btn">
            View Gift Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
