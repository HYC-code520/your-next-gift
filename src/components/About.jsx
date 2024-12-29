import React from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner
import '../styles/About.css'; // Import the CSS file for styling
import aboutImage from '../Image/aboutme.png';


function About() {
  return (
    <div>
      <PageBanner title="The DIY Life Chose Me"  />
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
