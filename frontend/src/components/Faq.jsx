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
    {
      question: 'Can I request a custom color for my DIY project?',
      answer: 'Absolutely! Let me know your preferred colors, and I’ll do my best to include them.',
    },
    {
      question: 'Do you ship the DIY projects?',
      answer: 'Currently, I only create projects for local pickup, but I’m exploring shipping options.',
    },
    {
      question: 'What tools do you use for DIY projects?',
      answer: 'I use various tools like scissors, hot glue guns, sewing machines, and more depending on the project.',
    },
    {
      question: 'Can I suggest a new DIY project idea?',
      answer: 'Yes, I’d love to hear your ideas! You can submit suggestions through the request form.',
    },
    {
      question: 'How do I take care of my DIY project?',
      answer: 'Care instructions are provided with each project. Generally, handle with care and avoid water exposure unless specified.',
    },
    {
      question: 'Are your projects suitable for pets?',
      answer: 'Some projects are pet-friendly, like the pet treat hider or hideouts. Check the description for suitability.',
    },
    {
      question: 'Can I cancel or change my DIY request?',
      answer: 'If your project hasn’t started yet, you can modify or cancel your request. Reach out ASAP to let me know.',
    },
    {
      question: 'Do you offer tutorials or workshops?',
      answer: 'Not yet, but I’m considering adding tutorials and live workshops in the future!',
    },
  ];

  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <PageBanner title="FAQ" className="faq-page-banner" />
      <div className="faq-container">
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
    </div>
  );
}

export default Faq;
