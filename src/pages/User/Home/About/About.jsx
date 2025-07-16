import React from 'react';

import about_img from "../../../../images/image/about.png";
import './About.css';



const About = () => {
  return (
    <div className='about container' id="about">
      <div className='about-left'>
        <img src={about_img} alt="About PCPC" className='about-img' />
      </div>
      <div className='about-right'>
        <h1>What is PCPC?</h1>
        <p>PCPC (Palestinian Collegiate Programming Contest) is an annual programming competition held in Palestine, aiming to enhance the analytical thinking and problem-solving skills of university students by challenging them to solve complex programming problems within a limited time. The contest is part of the regional and international competitive programming contests (ACM-ICPC), where winners qualify to participate in the Arab and regional competitions. This provides an opportunity to represent Palestine internationally and develop students' abilities in programming and computer engineering.</p>
      </div>
    </div>
  );
}

export default About;
