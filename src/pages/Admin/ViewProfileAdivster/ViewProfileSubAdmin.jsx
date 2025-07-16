import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaLinkedin, FaGithub } from "react-icons/fa";

import { SiGmail } from "react-icons/si";
import axios from "axios";
import "./ViewProfileSubAdmin.css";
import Loader from "../../../Loader/Loader";

export default function ViewProfileSubAdmin() {
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const token = localStorage.getItem("user token");
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/UsersProfile/Profile/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUserData(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="profile-container">
        <div className="profile-header xl">
          <div className="profile-info xl">
            <div className="profile-image">
              <img src={userData.image} alt="user" />
            </div>
            <div className="profile-details">
              <h4 className="profile-name">{userData.userName}</h4>
              <div className="profile-position">
                {/*   <p className="profile-text">{userData.description}</p>*/}
                <div className="profile-divider xl"></div>
                <p className="profile-text">{userData.universityName}</p>
              </div>
            </div>
          </div>

          <div className="profile-links flex flex-col items-end gap-4 mt-4">
            <Link
              to="https://www.facebook.com/PimjoHQ"
              target="_blank"
              rel="noopener"
              className="profile-link"
            >
              <FaGithub className="icon-view-adivster" />
            </Link>
            <Link to={`mailto:${userData.email}`} className="profile-link">
              <SiGmail className="icon-view-adivster" />
            </Link>
            <Link
              to={userData.linkedInLink || "https://www.linkedin.com"}
              target="_blank"
              rel="noopener"
              className="profile-link"
            >
              <FaLinkedin className="icon-view-adivster" />
            </Link>
          </div>
        </div>
      </div>

      <div className="user-info-card">
        <div className="header">
          <div>
            <h4 className="title">Personal Information</h4>

            <div className="personal-info">
              <div>
                <p>Name</p>
                <p className="text">{userData.userName}</p>
              </div>

              <div>
                <p>Email address</p>
                <p className="text">{userData.email}</p>
              </div>
              <div>
                <p>About me</p>
                <p className="text">{userData.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
