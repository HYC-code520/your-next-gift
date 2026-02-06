import { useState, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import NavBar from './NavBar';
import AnnouncementBar from './AnnouncementBar';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import { supabase } from '../lib/supabaseClient';

function AppLayout() {
  const [diyProjects, setDiyProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldFadeIn, setShouldFadeIn] = useState(false);
  const location = useLocation();

  // Fetch DIY projects on initial load
  useEffect(() => {
    async function fetchDiyProjects() {
      setIsLoading(true);
      setShouldFadeIn(false);
      
      // Fetch data and wait minimum 1 second (faster loading for initial load)
      const [data] = await Promise.all([
        supabase
          .from('diy_projects')
          .select('*')
          .order('id', { ascending: true }),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);
      
      if (data.error) {
        console.error('Error fetching DIY projects:', data.error);
      } else {
        // Transform snake_case to camelCase to match existing component structure
        const transformedData = data.data.map(project => ({
          id: project.id.toString(),
          projectName: project.project_name,
          description: project.description,
          materials: project.materials,
          estimatedTime: project.estimated_time,
          images: project.images,
          categories: project.categories || [],
        }));
        setDiyProjects(transformedData);
      }
      
      setIsLoading(false);
      setIsInitialLoad(false);
      // Trigger fade-in immediately when loading screen exits
      setTimeout(() => setShouldFadeIn(true), 50);
    }
    
    fetchDiyProjects();
  }, []);

  // Handle page transitions - use useLayoutEffect to prevent flash
  useLayoutEffect(() => {
    // Always scroll to top on route change
    window.scrollTo(0, 0);

    if (!isInitialLoad) {
      // Immediately set transitioning state before paint
      setIsPageTransitioning(true);
      setShouldFadeIn(false);

      // Loading animation for page transitions (1 second)
      const timer = setTimeout(() => {
        setIsPageTransitioning(false);
        // Trigger fade-in immediately when loading screen exits
        setTimeout(() => setShouldFadeIn(true), 50);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isInitialLoad]);

  const isHomePage = location.pathname === '/';
  const showLoadingScreen = isLoading || isPageTransitioning;

  return (
    <>
      {/* Loading Screen - Shows on initial load and page transitions */}
      <LoadingScreen isLoading={showLoadingScreen} />
      
      <div className="flex flex-col min-h-screen">
        {/* <AnnouncementBar /> */}
        <NavBar />
        <div
          className={`flex-1 flex flex-col main-content ${isHomePage ? 'home-page' : ''}`}
          style={{
            visibility: (isPageTransitioning || isLoading) ? 'hidden' : 'visible',
            opacity: shouldFadeIn ? 1 : 0,
            transform: shouldFadeIn ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Outlet
            context={{
              diyProjects,
              isLoading,
            }}
          />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AppLayout;
