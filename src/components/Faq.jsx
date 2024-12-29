import React, { useState } from 'react';
import PageBanner from './PageBanner'; // Import the generalized banner
import '../styles/Faq.css';

function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: 'What materials do you use for your projects?',
      answer: 'I use a variety of materials, including wood, fabric, paper, and more.',
    },
    {
      question: 'How long does it take to complete a project?',
      answer: 'It depends on the project. Each listing provides an estimated completion time.',
    },
  ];

  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <PageBanner title="So, You’re Wondering…"  />
      <ul className="faq-list">
        {faqData.map((item, index) => (
          <li key={index} className="faq-item">
            <button
              className="faq-question"
              onClick={() => toggleDropdown(index)}
            >
              {item.question}
              <span className={`faq-icon ${activeIndex === index ? 'open' : ''}`}>
                {activeIndex === index ? '-' : '+'}
              </span>
            </button>
            {activeIndex === index && <p className="faq-answer">{item.answer}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Faq;
