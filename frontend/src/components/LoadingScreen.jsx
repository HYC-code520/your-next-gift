import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/LoadingScreen.css';

function LoadingScreen({ isLoading, onComplete }) {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(1);
  const [isVisible, setIsVisible] = useState(true);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // Sync visibility immediately when loading starts (before paint)
  useLayoutEffect(() => {
    if (isLoading) {
      setIsVisible(true);
      setProgress(1);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      // Stop any running animation
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isAnimatingRef.current = false;

      // Complete the progress bar to 100%
      setProgress(100);

      // Brief hold at 100%, then fade out
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 200);

      return () => clearTimeout(timer);
    } else if (!isAnimatingRef.current) {
      // Only start animation if not already animating
      isAnimatingRef.current = true;

      startTimeRef.current = Date.now();

      // SUPER fast from 1-95%, then slow down dramatically at 95-98%
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev; // Stop at 98%, wait for actual load

          // Calculate time elapsed (in seconds)
          const elapsed = (Date.now() - startTimeRef.current) / 1000;

          let targetProgress;
          if (elapsed < 0.4) {
            // SUPER FAST: reach 95% in just 0.4 seconds (was 0.7)
            targetProgress = 1 + (94 * (elapsed / 0.4));
          } else {
            // Very slow: crawl from 95% to 98% over remaining time
            const slowElapsed = elapsed - 0.4;
            targetProgress = 95 + (3 * (1 - Math.exp(-slowElapsed / 0.6)));
          }

          // Smoothly move towards target
          const speed = prev < 95 ? 0.5 : 0.05; // Even faster until 95%, then very slow
          return Math.min(prev + (targetProgress - prev) * speed, 98);
        });
      }, 40); // Update every 40ms for smooth animation

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [isLoading, onComplete]);

  // Stay mounted while loading OR while exit animation plays
  if (!isVisible && !isLoading) return null;

  return (
    <div className={`load-in-screen ${!isLoading ? 'load-in-screen-exit' : ''}`}>
      {/* Progress Bar */}
      <div className="load-in-indicator">
        <div 
          className="indicator-filler"
          style={{ 
            transform: `translateX(${progress - 100}%)`,
            transition: progress === 100 ? 'transform 0.3s ease-out' : 'none',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Brand/Logo in Center */}
      <div className="load-in-brand-wrap">
        <div className="load-in-brand">
          <div className="flex flex-col items-center">
            {/* Logo Image */}
            <div className="logo-wrapper">
              <img
                src={theme === 'dark' ? '/logo-ariel-white.png' : '/logo-ariel.png'}
                alt="Made by Ariel"
                className="logo-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
