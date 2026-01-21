import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import Banner from './Banner';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer'; // Import Footer component
import { supabase } from '../lib/supabaseClient';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch DIY projects from Supabase
    async function fetchDiyProjects() {
      const { data, error } = await supabase
        .from('diy_projects')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) {
        console.error('Error fetching DIY projects:', error);
      } else {
        // Transform snake_case to camelCase to match existing component structure
        const transformedData = data.map(project => ({
          id: project.id.toString(),
          projectName: project.project_name,
          description: project.description,
          materials: project.materials,
          estimatedTime: project.estimated_time,
          images: project.images,
        }));
        setDiyProjects(transformedData);
      }
    }
    
    fetchDiyProjects();
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
