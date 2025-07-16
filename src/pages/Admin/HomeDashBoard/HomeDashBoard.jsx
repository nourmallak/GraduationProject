import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

import './HomeDashBoard.css';
import HeroDashBorad from './HeroDashBorad/HeroDashBorad';
import PhotoSlider from './SliderImage/SliderImage';
import SliderImage from './SliderImage/SliderImage';


export default function HomeDashBoard() {


  return (
    <div className="dashboard-container">
      <HeroDashBorad />
      <SliderImage />
    </div>
  );
}
