import { useContext, useState, useEffect } from "react";
import logo from "../../../images/logo/logo.png";
import style from "../Navbar/navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../context/Context";

export default function Navbar() {
  const { isLogin, setIsLogin, userProfile, setUserProfile } = useContext(UserContext);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("user token") || '';
  if (token && token.split('.').length === 3) {
    try {
      const decoded = jwtDecode(token);
      setId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
      setName(decoded["sub"]);
      setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      setIsLogin(true);
    } catch (err) {
      console.error("Token decode failed:", err);
      setIsLogin(false);
    }
  } else {
    console.warn("Invalid or missing token");
    setIsLogin(false);
  }
}, [isLogin]);

  function handleLogout() {
    localStorage.removeItem("user token");
        sessionStorage.removeItem("user token");
    setIsLogin(false);
    setUserProfile(null);
    navigate("/signin");
  }

  return (
    <nav className={`${style.nav} navbar navbar-expand-lg`}>
      <div className="container">
        <div className="d-flex align-items-center"> 
          <button
            className="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <img src={logo} className={`${style.logo}`} alt="Logo" />
                 
        </div>

        <div className="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
          <ul className={`${style.navbarNav} navbar-nav mb-2 mb-lg-0`}>
            <li className="nav-item">
              <Link className={`${style.navLink} nav-link`} to="/">Home</Link>
            </li>
            {isLogin &&
            <li className="nav-item">
              <Link className={`${style.navLink} nav-link`} to="/community">Community</Link>
            </li>
            }
            <li className="nav-item">
              <Link className={`${style.navLink} nav-link`} to="/publicarchive">Archive</Link>
            </li>
            <li className="nav-item">
              <Link className={`${style.navLink} nav-link`} to="/university">Universities</Link>
            </li>

             <li className="nav-item">
              <Link className={`${style.navLink} nav-link`} to="/rules"> Rules</Link>
            </li>
          </ul>
        </div>

        <div className="d-flex align-items-center">
          {isLogin ? (
            <div className="dropdown">
              <a
                className={`${style.dropdownToggle} btn btn-secondary dropdown-toggle`}
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span>{name}</span>
              </a>
              <ul className={`${style.dropdownMenu} dropdown-menu`}>
                <li>
                  <Link className={`${style.dropdownItem} dropdown-item`} to={`/profile/${id}`}>
                    My Profile
                  </Link>
                </li>
                {role === "Admin" && (
                  <li>
                    <Link className={`${style.dropdownItem} dropdown-item`} to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                )}
                {role === "SubAdmin" && (
                  <li>
                    <Link className={`${style.dropdownItem} dropdown-item`} to="/dashboardsubadmin">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link className={`${style.dropdownItem} dropdown-item`} onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <div className="d-flex flex-wrap">
              <Link className={`${style.btnn} btn me-2`} type="button" to="/signin">
                Sign in
              </Link>
              <Link className={`${style.btnn} btn me-2`} type="button" to="/signup">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
