import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Home.css';
import bgElement from '../Image/bg element 01.gif';
import bgGrain from '../Image/grain element under text.png';
import bgText from '../Image/bg text.gif';
import bgElementLight from '../Image/bg element for light mode.gif';
import bgTextLight from '../Image/bg text for light mode.gif';

// Remove the Netscape loop extension from a GIF so it plays exactly once
function removeGifLoop(buffer) {
  const bytes = new Uint8Array(buffer);
  // Netscape 2.0 extension: 21 FF 0B "NETSCAPE2.0" 03 01 [lo] [hi] 00
  const sig = [0x21, 0xFF, 0x0B, 0x4E, 0x45, 0x54, 0x53, 0x43,
               0x41, 0x50, 0x45, 0x32, 0x2E, 0x30];
  for (let i = 0; i < bytes.length - 19; i++) {
    if (sig.every((b, j) => bytes[i + j] === b)) {
      // Found it — remove the 19-byte block
      const result = new Uint8Array(bytes.length - 19);
      result.set(bytes.subarray(0, i));
      result.set(bytes.subarray(i + 19), i);
      return result.buffer;
    }
  }
  return buffer;
}

function Home() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const lightElementRef = useRef(null);
  const lightTextRef = useRef(null);

  // Tag body so navbar/footer can go transparent on home page
  useEffect(() => {
    document.body.classList.add('home-page');
    return () => document.body.classList.remove('home-page');
  }, []);

  // Make light-mode GIFs play once by stripping the loop extension
  useEffect(() => {
    if (isDark) return;
    const blobUrls = [];

    const makePlayOnce = async (img) => {
      if (!img) return;
      try {
        const res = await fetch(img.src);
        const buffer = await res.arrayBuffer();
        const patched = removeGifLoop(buffer);
        const blob = new Blob([patched], { type: 'image/gif' });
        const blobUrl = URL.createObjectURL(blob);
        blobUrls.push(blobUrl);
        img.src = blobUrl;
      } catch {
        // ignore
      }
    };

    makePlayOnce(lightElementRef.current);
    makePlayOnce(lightTextRef.current);
    return () => blobUrls.forEach(URL.revokeObjectURL);
  }, [isDark]);

  return (
    <div className="home-container">
      {/* Slideshow Section */}
      <div className="slideshow">
        {/* Light mode: layered GIFs */}
        {!isDark && (
          <div className="slideshow-light-bg">
            <img
              ref={lightElementRef}
              src={bgElementLight}
              alt=""
              className="light-gif light-gif-element"
            />
            <img
              src={bgGrain}
              alt=""
              className="light-gif light-gif-grain"
            />
            <img
              ref={lightTextRef}
              src={bgTextLight}
              alt=""
              className="light-gif light-gif-text"
            />
          </div>
        )}

        {/* Dark mode: layered GIFs */}
        {isDark && (
          <div className="slideshow-dark-bg">
            <img
              src={bgElement}
              alt=""
              className="dark-gif dark-gif-element"
            />
            <img
              src={bgGrain}
              alt=""
              className="dark-gif dark-gif-grain"
            />
            <img
              src={bgText}
              alt=""
              className="dark-gif dark-gif-text"
            />
          </div>
        )}

        <div className="slide-content">
          {/* Button to Gift Gallery */}
          <Link to="/list" className="gift-gallery-btn">
            View Gift Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
