import React from 'react';
import '../styles/About.css'; // Import the CSS file for styling
import aboutImage from '../Image/aboutme.png';


function About() {
  return (
    <div>
      <div className="about-container">
        <img
          src={aboutImage} // Use the imported image
          alt="About Me"
          className="about-image"
        />
        <p className="about-text">
          Hi! I'm a passionate DIY enthusiast who loves creating handmade gifts for friends.
          This website showcases my projects and allows my friends to request custom gifts.
        </p>
      </div>
    </div>
  );
}

export default About;
