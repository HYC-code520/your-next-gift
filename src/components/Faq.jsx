import React from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner

function Faq() {
  return (
    <div>
      <PageBanner title="FAQ" subtitle="Answers to common questions about my DIY projects" />
      <ul>
        <li>What materials do you use for your projects?</li>
        <p>I use a variety of materials, including wood, fabric, paper, and more.</p>
        <li>How long does it take to complete a project?</li>
        <p>It depends on the project. Each listing provides an estimated completion time.</p>
      </ul>
    </div>
  );
}

export default Faq;
