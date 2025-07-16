import React from 'react';
import { motion } from 'framer-motion';

import { BiPlay } from "react-icons/bi";
import Hero from './Hero/Hero';
import About from './About/About';
import University from './UniversityHome/University';
import PhotoSlider from './PhotoSlider/PhotoSlider';
import Community from './Community/Community';
import FAQ from './FAQ/FAQ';
import ContactUs from './ContactUs/ContactUs.JSX';
import Experiences from './Experiences/Experiences'
import TestimonialCard from './TestimonialCard/TestimonialCard'

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Home() {
  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Hero />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <About />
      </motion.div>   
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <PhotoSlider />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <University />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Community />
      </motion.div>
      
       <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <TestimonialCard  />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <FAQ />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Experiences />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <ContactUs />
      </motion.div>

    </>
  );
}
/*import React from 'react'
import Navbar from '../../Component/Navbar/Navbar'
import Hero from './Hero'
import About from './About'
import UniversityHome from './UniversityHome'
import Community from './Community'
import PhotoSlider from './PhotoSlider'
import Footer from '../../Component/Footer/Footer'
import ContactUs from './ContactUs'
import Experiences from '../../Component/Experiences/Experiences'
import FAQ from './Faq'
import Faq from './Faq'

export default function Home() {
  
  return (
   <>

   <Hero />
   <About />
   <PhotoSlider />
   <UniversityHome />
   <Community />
   <Faq />
   <Experiences />
   <ContactUs />

   </>
  )
} الكود بدون انيمشين */