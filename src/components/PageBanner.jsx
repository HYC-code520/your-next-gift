import React from 'react';
import '../styles/PageBanner.css';

function PageBanner({ title, description, className }) {
  return (
    <div className={`page-banner ${className}`}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

export default PageBanner;