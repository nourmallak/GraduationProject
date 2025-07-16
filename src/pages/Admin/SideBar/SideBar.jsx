import React from "react";
import { FaArchive, FaBars, FaTh } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdPersonAdd } from "react-icons/io";
import { IoMdNotifications } from "react-icons/io";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { CgDarkMode } from "react-icons/cg";
import { FaQuestionCircle } from "react-icons/fa";
import { RiFeedbackLine } from "react-icons/ri";
import { MdAddHomeWork } from "react-icons/md";
import { FaUniversity } from "react-icons/fa";
import { MdRule } from "react-icons/md";
import logo from "../../../images/logo/logo.png";
import "./SideBar.css";
import NavSideBar from "../../../components/Commone/NavSideBar/NavSideBar";
import Header from "../../../components/Commone/HeaderSideBar/HeaderSiderBar";
import { SiManageiq } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../../context/Context";

const SideBar = ({ isOpen, toggleSidebar }) => {
  const { setIsLogin } = useContext(UserContext);
  const navigate = useNavigate();

  // دالة تسجيل الخروج
  function handleLogout() {
    localStorage.removeItem("user token"); // إزالة التوكن من الذاكرة
    setIsLogin(false); // تحديث حالة تسجيل الدخول في Context
    navigate('/signin'); // إعادة التوجيه إلى صفحة تسجيل الدخول
  }

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
        <NavSideBar
          isOpen={isOpen}
          title="Dashboard"
          icon={FaTh}
          to="/dashboard"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Manage Home"
          icon={SiManageiq}
          to="/dashboard/managehome"
        />
        <NavSideBar
          isOpen={isOpen}
          title=" List SubAdmin"
          icon={FaUserGroup}
          to="/dashboard/listadv"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Add SubAdmin"
          icon={IoMdPersonAdd}
          to="/dashboard/addsubadmin"
        />
        <NavSideBar
          isOpen={isOpen}
          title="List University"
          icon={FaUniversity}
          to="/dashboard/listuniversity"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Add University"
          icon={MdAddHomeWork}
          to="/dashboard/adduniversity"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Manage Archive"
          icon={FaArchive}
          to="/dashboard/managearchive"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Manage Experiences"
          icon={RiFeedbackLine}
          to="/dashboard/manageexperinces"
        />
        <NavSideBar
          isOpen={isOpen}
          title="Rules"
          icon={MdRule} 
          to="/rules"
        />
        <NavSideBar
          isOpen={isOpen}
          title="FAQS"
          icon={FaQuestionCircle}
          to="/dashboard/faq"
        />
        <NavLink
          className="link-navdashboard"
          style={{ justifyContent: isOpen ? "flex-start" : "center" }}
          onClick={handleLogout} // عند الضغط على الخروج، يتم استدعاء دالة تسجيل الخروج
        >
          <div className="icon-navdashboard">
            <FaSignOutAlt />
          </div>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="link_text-navdashboard"
          >
            Log Out
          </div>
        </NavLink>
      </div>

      <div
        className="main-dashboadr"
        style={{ marginLeft: isOpen ? "250px" : "85px" }}
      >
        <Header toggleDarkMode={() => {}} />
      </div>
    </div>
  );
};

export default SideBar;
