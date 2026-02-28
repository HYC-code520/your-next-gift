import { useState, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../App.css';
import bgUnderLayer from '../Image/Cartoon bg under layer.png';
import bgAnimationTop from '../Image/Cartoon bg animation at top.gif';
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
  const [bgIsHomePage, setBgIsHomePage] = useState(true);
  const [showDelayedLoading, setShowDelayedLoading] = useState(false);
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
          colorOptions: project.color_options ?? null,
          sizeOptions: project.size_options ?? null,
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
      const leavingHome = bgIsHomePage && location.pathname !== '/';

      // Immediately: hide content
      setIsPageTransitioning(true);
      setShouldFadeIn(false);

      if (leavingHome) {
        // Home → other page: GIF slides down, loading screen overlaps
        setBgIsHomePage(false);

        const loadingDelay = setTimeout(() => {
          setShowDelayedLoading(true);
        }, 300);

        const timer = setTimeout(() => {
          setIsPageTransitioning(false);
          setShowDelayedLoading(false);
          setTimeout(() => setShouldFadeIn(true), 50);
        }, 800);

        return () => {
          clearTimeout(loadingDelay);
          clearTimeout(timer);
        };
      } else if (location.pathname === '/') {
        // Other page → home: loading screen first, GIF slides up as it exits
        setShowDelayedLoading(true);

        const bgTimer = setTimeout(() => {
          setBgIsHomePage(true);
        }, 400);

        const timer = setTimeout(() => {
          setIsPageTransitioning(false);
          setShowDelayedLoading(false);
          setTimeout(() => setShouldFadeIn(true), 50);
        }, 600);

        return () => {
          clearTimeout(bgTimer);
          clearTimeout(timer);
        };
      } else {
        // All other transitions: quick loading screen
        setBgIsHomePage(false);
        setShowDelayedLoading(true);

        const timer = setTimeout(() => {
          setIsPageTransitioning(false);
          setShowDelayedLoading(false);
          setTimeout(() => setShouldFadeIn(true), 50);
        }, 400);

        return () => clearTimeout(timer);
      }
    } else {
      setBgIsHomePage(location.pathname === '/');
    }
  }, [location.pathname, isInitialLoad]);

  const isHomePage = location.pathname === '/';
  const showLoadingScreen = isLoading || showDelayedLoading;

  return (
    <>
      {/* Loading Screen - Shows on initial load and page transitions */}
      <LoadingScreen isLoading={showLoadingScreen} />
      
      <div className="flex flex-col min-h-screen" style={{ position: 'relative' }}>
        <img
          src={bgUnderLayer}
          alt=""
          className={`global-bg-under-layer${!bgIsHomePage ? ' bg-faded' : ''}`}
        />
        <img
          src={bgAnimationTop}
          alt=""
          className={`bg-animation-top${!bgIsHomePage ? ' bg-hidden' : ''}`}
        />
        {/* Mobile-only home background image */}
        {bgIsHomePage && (
          <img
            src="/images/phone-size-bg-image.png"
            alt=""
            className="mobile-home-bg"
          />
        )}
        {/* <AnnouncementBar /> */}
        <NavBar />
        <div
          className={`flex-1 flex flex-col main-content ${isHomePage ? 'home-page' : ''}`}
          style={{
            visibility: (isPageTransitioning || isLoading) ? 'hidden' : 'visible',
            opacity: shouldFadeIn ? 1 : 0,
            transform: shouldFadeIn ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            zIndex: isHomePage ? 3 : 1
          }}
        >
          <Outlet
            context={{
              diyProjects,
              isLoading,
            }}
          />
        </div>
        <Footer isHomePage={isHomePage} />
      </div>
    </>
  );
}

export default AppLayout;
