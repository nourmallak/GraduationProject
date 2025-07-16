import React from 'react';
import { CgProfile } from 'react-icons/cg';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../../images/logo/logo.png'
import './HeaderSideBar.css'; // تأكد من وجود ملف CSS

export default function Header() {
  return (
    <div className="headerDashBoard-nav">
      <div className="logoContainer-nav">
        <img src={logo} className="logoTopDashBoard-nav" />
      </div>
      <div className="iconsContainer-nav">
        <Link to="/">
          <FaHome className="icon-nav" />
        </Link>
      </div>
    </div>
  );
}
