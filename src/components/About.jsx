import React from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner

function About() {
  return (
    <div>
      <PageBanner title="About Me" subtitle="Learn more about my DIY journey and passion" />
      <p>
        Hi! I'm a passionate DIY enthusiast who loves creating handmade gifts for friends.
        This website showcases my projects and allows my friends to request custom gifts.
      </p>
    </div>
  );
}

export default About;
