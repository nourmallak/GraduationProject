import React, { useState, useEffect } from "react";
import Slider from 'react-slick';
import { Link, useParams } from 'react-router-dom';
import { Avatar } from '@mui/material';
import Loader from '../../../Loader/Loader';
import axios from "axios";
import Swal from "sweetalert2";
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './SubAdminUniversity.css';

export default function LatestExperiences() {
  const [isLoading, setIsLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem("user token");
  const { id } = useParams();

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/University/GetUniversityDetails/${id}`);
      setFeedbacks(response.data.subAdmins || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleDeleteSubAdmin = async (adminId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the Sub Admin!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: 'custom-swal-icon'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API}/Auths/Remove-Sub-Admin/${adminId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Deleted!', 'Sub Admin has been deleted.', 'success');
          getData();
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete Sub Admin.', 'error');
        }
      }
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <hr className='feedback-line' />
      <div className="feedback-container">
        <h2 className='feedback-title'>Distinguished Contributors</h2>
        <Slider {...sliderSettings}>
          {feedbacks.length > 0 ? (
            feedbacks.slice(0, 5).map((item, index) => (
              <div key={index} className="feedback-card">
                <div className="feedback-content">
                  <div className="feedback-row combined-info">
                    <Avatar
                      className="active-avatar"
                      src={item.imageUrl || undefined}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 60,
                        height: 60,
                        fontSize: 24,
                      }}
                    >
                      {!item.imageUrl && (item.userName?.[0]?.toUpperCase() || "U")}
                    </Avatar>
                    
                    <div>
                      <h3 className="usernamePersonal">{item.userName}</h3>
                      {item.email && (
                        <div className="icon-link">
                          <FaEnvelope /> <span className="email-text">{item.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="feedback-text fixed-height">
                    <p className="speech-bubble">
                      <span className="quote">“</span>
                      <span className="text">{item.description}</span>
                      <span className="quote under">”</span>
                    </p>
                    <div className="links" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                      {item.githubLink && (
                        <a href={item.githubLink} target="_blank" rel="noopener noreferrer">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {item.linkedInLink && (
                        <a href={item.linkedInLink} target="_blank" rel="noopener noreferrer">
                          <FaLinkedin size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No contributors available.</p>
          )}
        </Slider>
        <div className="write-container">
          <Link to='/singlepageexperincse' className="write-btn">View more Contributors</Link>
        </div>
      </div>
    </div>
  );
}
