import React, { useContext, useState } from "react";
import Countdown from "react-countdown";
import { FaPlusCircle } from "react-icons/fa";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import {
  FaEdit,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTrashAlt,
} from "react-icons/fa";
import { HomePageContext } from "../../../../context/HomePageContext";
import { useNavigate } from "react-router-dom";
import "./HeroDashBorad.css";
import Swal from "sweetalert2";
import axios from "axios";
export default function HeroDashBorad() {
  const { data, getUser } = useContext(HomePageContext);

  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(isoString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="simple-hero">
      <div
        className="hero-image"
        style={{
          backgroundImage: `url(${data.cover})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          width: "100%",
        }}
      ></div>
      <div className="action-icons">
        <FaEdit
          className="icon-button edit-icon"
          onClick={() => navigate("/dashboard/editherodashbaord")}
          title="modification"
        />
        <FaPlusCircle
  className="icon-button add-icon"
  onClick={() => navigate("/dashboard/addimageshome")}
  title="Add Images"
/>

        <FaTrashAlt
          className="icon-button delete-icon"
          onClick={() => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won’t be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f8800f",
    cancelButtonColor: "red",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      icon: "custom-swal-icon",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://pcpc.runasp.net/MainPage/delete/${data.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user token")}`,
          },
        })
        .then(() => {
          Swal.fire("Deleted!", "Your data has been deleted.", "success");
          getUser(); 
        })
        .catch(() => {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        });
    }
  });
}}

          title="Delete"
        />
      </div>

      <div className="centered-content">
        <h1 className="event-title">PCPC NEXT</h1>

        {data.date && (
          <p className="event-date" style={{ fontSize: "18px", color: "#333" }}>
            {formatDate(data.date)}
          </p>
        )}

        {data.date && new Date(data.date).getTime() > Date.now() ? (
          <div className="event-countdown">
            <Countdown
              date={new Date(data.date).getTime()}
              renderer={({ days, hours, minutes, seconds }) => (
                <>
                  <div className="time-box">
                    {days}
                    <small>Days</small>
                  </div>
                  <div className="time-box">
                    {hours}
                    <small>Hours</small>
                  </div>
                  <div className="time-box">
                    {minutes}
                    <small>Minutes</small>
                  </div>
                  <div className="time-box">
                    {seconds}
                    <small>Seconds</small>
                  </div>
                </>
              )}
            />
          </div>
        ) : (
          <p style={{ color: "#000", fontSize: "18px" }}>
           "Loading or the event has ended"
          </p>
        )}

        <div className="event-video-icon" onClick={() => setShowVideo(true)}>
          <MdOutlineSlowMotionVideo className="video-icon" />
        </div>

        <div className="social-icons-herodash">
          {data.facebookLink && (
            <a
              href={data.facebookLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>
          )}
          {data.instagramLink && (
            <a
              href={data.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
          )}
          {data.linkedInLink && (
            <a
              href={data.linkedInLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>
          )}
        </div>
      </div>

      {showVideo && (
        <div className="video-modal">
          <div className="video-content">
            <span
              className="close-btn-herodashboard"
              onClick={() => setShowVideo(false)}
            >
              &times;
            </span>
            <iframe
              src={data.video}
              title="PCPC 2025 Video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
