import React from 'react'
import { NavLink } from 'react-router-dom'
import './NavSideBar.css'
export default function NavSideBar({ isOpen, title, icon: Icon, to }) {
  return (
    <NavLink
      to={to}
      className="link-navdashboard"
      style={{ justifyContent: isOpen ? "flex-start" : "center" }}
    >
      <div className="icon-navdashboard">
        <Icon />
      </div>
      <div
        style={{ display: isOpen ? "block" : "none" }}
        className="link_text-navdashboard"
      >
        {title}
      </div>
    </NavLink>
  )
}
