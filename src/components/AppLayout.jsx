import { useState, useEffect } from 'react';
import '../App.css';
import { Outlet } from 'react-router-dom';
import Banner from './Banner';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8888/diyProjects')
      .then((response) => response.json())
      .then((diyProjectData) => setDiyProjects(diyProjectData));
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Banner */}
      <Banner />

      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <Outlet
        context={{
          diyProjects,
        }}
      />
    </>
  );
}

export default AppLayout;
