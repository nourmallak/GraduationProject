import React from 'react';
import '../UniversityHome/University';
import comm_img from '../../../../images/image/Connected.svg';

export default function Community() {
  return (
    <div className='about container' id="about">
      <div className='about-left'>
        <img src={comm_img} alt="Community" className='about-img' />
      </div>
      <div className='about-right'>
        <h1 className='h-community'> Community Page </h1>
        <p>
          The website includes a dedicated page for each Palestinian university, 
          providing comprehensive information about the university. The page also 
          features a special section with an archive of all programming contests 
          and events that have taken place at the university, allowing users to 
          easily access and explore its past activities and events.
        </p>
      </div>
    </div>
  );
}
