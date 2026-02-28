import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/Home.css';
import titleImg from '../Image/Your Next Gift Text.png';

function Home() {
  const { language } = useLanguage();

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
            {language === 'en' ? 'View Gift Gallery' : '瀏覽禮物'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
