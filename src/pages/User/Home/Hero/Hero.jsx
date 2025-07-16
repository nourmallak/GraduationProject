import React, { useContext, useState } from "react";
import Countdown from "react-countdown";
import "./Hero.css";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { HomePageContext } from "../../../../context/HomePageContext";

export default function Hero() {
  const { data } = useContext(HomePageContext);
  const [showVideo, setShowVideo] = useState(false);
  const [countdownComplete, setCountdownComplete] = useState(false);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};


  const handleCountdownComplete = () => {
    setCountdownComplete(true);
  };

  return (
    <div
      className="hero"
      style={{
        backgroundImage: `linear-gradient(rgba(246, 239, 217, 0.7), rgba(246, 239, 217, 0.7)),url(${data.cover})`,
      }}
    >
      <div className="hero-text">
        {!countdownComplete && (
          <>
            <h1>PCPC NEXT</h1>
            {data.date && (
              <p
                className="event-date"
                style={{ fontSize: "18px", color: "#333" }}
              >
                {formatDate(data.date)}
              </p>
            )}
            <div className="countdown">
              <Countdown
                date={new Date(data.date).getTime()}
                onComplete={handleCountdownComplete}
                renderer={({ days, hours, minutes, seconds }) => {
                  return (
                    <>
                      <div className="count">
                        {days}
                        <small>Days</small>
                      </div>
                      <div className="count">
                        {hours}
                        <small>Hours</small>
                      </div>
                      <div className="count">
                        {minutes}
                        <small>Minutes</small>
                      </div>
                      <div className="count">
                        {seconds}
                        <small>Seconds</small>
                      </div>
                    </>
                  );
                }}
              />
            </div>
          </>
        )}

        <div
          className={`video-icon-container ${
            countdownComplete ? "center-alone" : ""
          }`}
        >
          <MdOutlineSlowMotionVideo
            className="video-icon"
            onClick={() => setShowVideo(true)}
          />
        </div>
      </div>

      {showVideo && (
        <div className="video-modal">
          <div className="video-container">
            <span className="close" onClick={() => setShowVideo(false)}>
              &times;
            </span>
            <iframe
              width="1900"
              height="600"
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
