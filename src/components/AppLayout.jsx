import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import Banner from './Banner';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer'; // Import Footer component

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:8888/diyProjects')
      .then((response) => response.json())
      .then((diyProjectData) => setDiyProjects(diyProjectData));
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <>
      <AnnouncementBar />
      <Banner />
      <NavBar />
      <div className={`main-content ${isHomePage ? 'home-page' : ''}`}>
        <Outlet
          context={{
            diyProjects,
          }}
        />
      </div>
      <Footer /> {/* Add the Footer component */}
    </>
  );
}

export default AppLayout;
