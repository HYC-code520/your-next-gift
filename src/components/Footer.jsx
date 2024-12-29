import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h2>Stay Connected</h2>
        <p>Subscribe to our email list for the latest updates and DIY ideas!</p>
        <form className="subscribe-form">
          <input
            type="email"
            placeholder="Enter your email"
            aria-label="Email address"
          />
          <button type="submit">Subscribe</button>
        </form>
        <div className="social-media">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <img
              src="https://img.icons8.com/doodle/48/fae6f0/linkedin-circled.png"
              alt="LinkedIn"
            />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <img
              src="https://img.icons8.com/doodle/48/fae6f0/youtube-play.png"
              alt="YouTube"
            />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
          >
            <img
              src="https://img.icons8.com/doodle/48/fae6f0/instagram-new.png"
              alt="Instagram"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
