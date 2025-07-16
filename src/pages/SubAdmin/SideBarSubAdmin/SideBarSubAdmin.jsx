import React from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Commone/HeaderSideBar/HeaderSiderBar';


export default function SideBarSubAdmin({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className={`containerDash ${isOpen ? "" : "collapsed"}`}>
      <div
        style={{ width: isOpen ? "250px" : "85px", left: 0 }}
        className="sidebarDas fixed-sidebar"
      >
        <div className="top_section">
          <div
            className="bars"
            onClick={toggleSidebar}
            style={{ marginLeft: isOpen ? "190px" : "4px" }}
          >
            <FaBars />
          </div>
        </div>

         <button
          className="link-navdashboard"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%", // حتى ياخذ عرض العنصر مثل البقية
            padding: "10px 15px", // نفس المسافة
          }}
          onClick={handleLogout}
        >
          <div className="icon-navdashboard" style={{ fontSize: "20px" }}>
            <FaSignOutAlt />
          </div>
          <div
            className="link_text-navdashboard"
            style={{
              display: isOpen ? "block" : "none",
              marginLeft: "10px", // حتى يكون في مسافة بين الأيقونة والنص
            }}
          >
            Log Out
          </div>
        </button>
      </div>

      <div className="main-dashboadr" style={{ marginLeft: isOpen ? "250px" : "85px" }}>
        <Header />
      </div>
    </div>
  );
}
