import { useState, useEffect } from 'react';
import '../App.css';
import { Outlet, Link } from 'react-router-dom';
import NavBar from './NavBar';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]); // State to hold the list of DIY projects

  // Fetch DIY projects from the server when the component mounts
  useEffect(() => {
    fetch('http://localhost:8888/diyProjects')
      .then((response) => response.json())
      .then((diyProjectData) => setDiyProjects(diyProjectData));
  }, []);
  

  return (
    <>
      {/* Search Icon */}
      <div className="search-icon">
          <Link to="/search">
            🔍 
          </Link>
      </div>

      <NavBar />
      
      <Outlet
        context={{
          diyProjects: diyProjects, // Pass DIY projects to child components via context
        }}
      />
    </>
  );
}

export default AppLayout;
