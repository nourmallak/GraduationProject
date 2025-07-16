import React, { useEffect } from 'react';
import './SinglePageUniversity.css';
import AboutUniversity from './AboutUniversity/AboutUniversity';
import LeadersUniversity from './LeadersUniversity/LeadersUniversity';
import Competition from './Competition/Competition';
import CompetitionSuffix from './CompetitionSuffix/CompetitionSuffix';



export default function SingleUniversity() {
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const sections = document.querySelectorAll('.scrollSection');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          section.classList.add('appear');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className="scrollSection">
        <AboutUniversity />
      </div>
      <div className="scrollSection">
        <LeadersUniversity />
      </div>
      <div className="scrollSection">
        <Competition/>
      </div>
      <div className="scrollSection">
        <CompetitionSuffix/>
      </div>
   
    </>
  );
}
