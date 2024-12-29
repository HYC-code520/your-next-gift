import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Import useLocation
import '../App.css';
import Banner from './Banner';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);
  const location = useLocation(); // Get the current route

  useEffect(() => {
    fetch('http://localhost:8888/diyProjects')
      .then((response) => response.json())
      .then((diyProjectData) => setDiyProjects(diyProjectData));
  }, []);

  const isHomePage = location.pathname === '/'; // Check if the current route is the Home page

  return (
    <>
      <AnnouncementBar />
      <Banner />
      <NavBar />
      {/* Main Content */}
      <div className={`main-content ${isHomePage ? 'home-page' : ''}`}>
        <Outlet
          context={{
            diyProjects,
          }}
        />
      </div>
    </>
  );
}

export default AppLayout;
