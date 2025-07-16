// src/components/PageTitleSetter.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTitleSetter() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (path === '/') {
      document.title = 'Home';
    } else if (path === '/signin') {
      document.title = 'Sign In';
    } else if (path === '/signup') {
      document.title = 'Sign Up';
    } else if (path === '/forgetpassword') {
      document.title = 'Forgot Password';
    } else if (path === '/resetpassword') {
      document.title = 'Reset Password';
    } else if (path.startsWith('/profile')) {
      document.title = 'Profile';
    } else if (path.startsWith('/university')) {
      document.title = 'All Universities';
    } else if (path.startsWith('/singleuniversity')) {
      document.title = 'University Details';
    } else if (path.startsWith('/singlepageexperincse')) {
      document.title = 'Personal Experience';
    }else if (path.startsWith('/publicarchive') || path.startsWith('/universitycompetitions/:id') || path.startsWith('//universitycompetition/:competitionId') || path.startsWith('/competition/:id')) {
      document.title = 'Archive'; 
    }else if (path.startsWith('/community')) {
      document.title = 'Community';
    }

    // Admin dashboard
    else if (path === '/dashboard') {
      document.title = 'Dashboard';
    } else if (path.startsWith('/dashboard/addsubadmin')) {
      document.title = 'Add Sub-Admin';
    } else if (path.startsWith('/dashboard/adduniversity')) {
      document.title = 'Add University';
    } else if (path.startsWith('/dashboard/faq')) {
      document.title = 'FAQ Management';
    } else if (path.startsWith('/dashboard/edit-faq')) {
      document.title = 'Edit FAQ';
    } else if (path.startsWith('/dashboard/listadv')) {
      document.title = 'Sub-Admins List';
    } else if (path.startsWith('/dashboard/edituniversity')) {
      document.title = 'Edit University';
    } else if (path.startsWith('/dashboard/listuniversity')) {
      document.title = 'University List';
    } else if (path.startsWith('/dashboard/manageexperinces')) {
      document.title = 'Manage Experiences';
    } else if (path.startsWith('/dashboard/addimages')) {
      document.title = 'Add University Images';
    } else if (path.startsWith('/dashboard/viewdetailsuniversity')) {
      document.title = 'University Details';
    } else if (path.startsWith('/dashboard/viewdetailsarchiveuniversity')) {
      document.title = 'Archived University Details';
    } else if (path.startsWith('/dashboard/managehome')) {
      document.title = 'Manage Home Page';
    } else if (path.startsWith('/dashboard/viewprofile')) {
      document.title = 'View Sub-Admin Profile';
    } else if (path.startsWith('/dashboard/managearchive')) {
      document.title = 'Manage Archive';
    } else if (path.startsWith('/dashboard/editherodashbaord')) {
      document.title = 'Edit Hero Section';
    } else if (path.startsWith('/dashboard/addimageshome')) {
      document.title = 'Add Home Images';
    } 

    // Sub-admin dashboard
    else if (path.startsWith('/dashboardsubadmin')) {
      document.title = 'Sub-Admin Dashboard';
    }

    // Default
    else {
      document.title = 'website';
    }

  }, [location]);

  return null;
}
