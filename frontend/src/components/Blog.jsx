import React from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner
import '../styles/Blog.css'; // Add a separate CSS file for styling

function Blog() {
  return (
    <div>
      {/* PageBanner is placed outside the container for consistency */}
      <PageBanner title="Messy hands, happy heart." />
      <div className="blog-container">
        <p className="blog-intro"></p>
        <ul className="blog-list">
          <li>
            <h3>How I Made a Custom Wooden Shelf</h3>
            <p className="blog-description">A step-by-step guide on how I created a stylish wooden shelf using affordable materials.</p>
          </li>
          <li>
            <h3>5 Tips for Painting DIY Projects</h3>
            <p className="blog-description">These tips will make your painting projects look professional and polished.</p>
          </li>
          <li>
            <h3>My Favorite DIY Tools</h3>
            <p className="blog-description">A list of tools that I always keep in my DIY toolkit!</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Blog;
