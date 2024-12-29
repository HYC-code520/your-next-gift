import React from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner

function Blog() {
  return (
    <div>
      <PageBanner title="My Blog" subtitle="Updates on my latest DIY adventures" />
      <p>Stay tuned for updates on my latest DIY adventures!</p>
    </div>
  );
}

export default Blog;
