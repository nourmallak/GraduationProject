import React from 'react';
import un_img from '../../../../images/image/college.svg';
import './University.css';


export default function University() {
  return (
    <div className='unv container' id="about">
      <div className='unv-right'>
      <h1>University Pages </h1>
        <p>
          The website includes a dedicated page for each Palestinian university, 
          providing comprehensive information about the university. The page also 
          features a special section with an archive of all programming contests 
          and events that have taken place at the university, allowing users to 
          easily access and explore its past activities and events.
        </p>
      </div>
      <div className='unv-left'>
        <img src={un_img} alt="University" className='unv-img' />
      </div>
    </div>
  );
}