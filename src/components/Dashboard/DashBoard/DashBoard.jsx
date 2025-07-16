import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from '../../../pages/Admin/SideBar/SideBar';
import { Outlet } from 'react-router-dom';
import Loader from '../../../Loader/Loader';

export default function DashBoard() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <SideBar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className="content-container"
        style={{
          marginLeft: isOpen ? '250px' : '85px',
          paddingTop: '20px',
          paddingLeft: '20px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
