import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import { supabase } from '../lib/supabaseClient';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Fetch DIY projects from Supabase
    async function fetchDiyProjects() {
      setIsLoading(true);
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
          categories: project.categories || [], // Changed to categories (array)
        }));
        setDiyProjects(transformedData);
      }
      setIsLoading(false);
    }
    
    fetchDiyProjects();
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {/* <AnnouncementBar /> */}
      <NavBar />
      <div className={`flex-1 main-content ${isHomePage ? 'home-page' : ''}`}>
        <Outlet
          context={{
            diyProjects,
            isLoading,
          }}
        />
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
