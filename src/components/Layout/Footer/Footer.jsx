import React, { useContext } from 'react';
import './Footer.css';
import logo from '../../../images/image/footer.png';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { HomePageContext } from '../../../context/HomePageContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { data } = useContext(HomePageContext);

  return (
    <div className="site-footer" id="footer">
      <div className="footer-grid">
        <div className="footer-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="footer-links-info">
          <h2>Pages</h2>
          <ul>
            <Link to='/'><li>Home</li></Link>
            <Link to='/publicarchive'><li>Universities</li></Link>
            <Link to='/community'><li>Community</li></Link>

          </ul>
        </div>
        <div className="footer-links-pcpc">
          <h2>Useful Links</h2>
          <ul>
            <Link to='/publicarchive'><li>Archive</li></Link>
            <Link to='/rules'><li>PCPC Rules</li></Link>
            <Link to='/contact'><li>Contact Us</li></Link>
          </ul>
        </div>
        <div className="footer-description">
          <p>
            Hello, we are PCPC. Our goal is to revolutionize how students, teams, and universities
            engage with programming and problem-solving to create a positive and lasting impact.
          </p>
        </div>
      </div>

      <hr className="footer-separator" />

      <div className="footer-social">
        <a href={data.facebookLink} className="social-icon-link" target="_blank" rel="noopener noreferrer">
          <FaFacebookF />
        </a>
        <a href={data.instagramLink} className="social-icon-link" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href={data.linkedInLink} className="social-icon-link" target="_blank" rel="noopener noreferrer">
          <FaLinkedinIn />
        </a>
      </div>
    </div>
  );
}
