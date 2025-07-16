import React, { useEffect, useState } from "react";
import "./LeadersUniversity.css"; // تأكد من استخدام ملف CSS مناسب
import { Avatar, Skeleton } from "@mui/material";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import Loader from "../../../../Loader/Loader";

export default function Leaders() {
  const [leaders, setLeaders] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const getLeaders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/University/GetUniversityDetails/${id}`
      );
      setLeaders(response.data.subAdmins || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLeaders();
  }, []);
  if (isLoading) return <Loader />;

  if (leaders.length === 0 && !isLoading) {
    return null; 
  }

  return (
    <div className="leaders-container">
      <h2 className="leaders-title">University Leaders</h2>
      <Slider {...sliderSettings}>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="leader-card">
              <div className="leader-content">
                <Skeleton variant="circular" width={90} height={60} />
                <Skeleton variant="text" width="100px" />
                <Skeleton variant="text" width="150px" />
                <Skeleton variant="rounded" width="250px" height="100px" />
              </div>
            </div>
          ))
        ) : leaders.length > 0 ? (
          leaders.map((leader, index) => (
            <div key={index} className="leader-card">
              <div className="leader-content">
                <div className="leader-info">
                  <Avatar
                    className="active-avatar"
                    src={leader.imageUrl || undefined}
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 60,
                      height: 60,
                      fontSize: 24,
                    }}
                  >
                    {!leader.imageUrl &&
                      (leader.userName[0]?.toUpperCase() || "L")}
                  </Avatar>
                  <h3 className="leader-name">{leader.userName}</h3>
                </div>
                <p className="leader-desc">
                  {leader.description || "No description provided."}
                </p>
                <div className="leader-social">
                  {leader.linkedInLink ? (
                    <a
                      href={leader.linkedInLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  ) : (
                    <FaLinkedin className="disabled" />
                  )}

                  {leader.githubLink ? (
                    <a
                      href={leader.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaGithub />
                    </a>
                  ) : (
                    <FaGithub className="disabled" />
                  )}

                  {leader.email ? (
                    <a href={`mailto:${leader.email}`}>
                      <SiGmail />
                    </a>
                  ) : (
                    <SiGmail className="disabled" />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : null}
      </Slider>
    </div>
  );
}
