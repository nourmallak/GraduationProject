import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { Avatar, Skeleton } from "@mui/material";
import Loader from "../../../../Loader/Loader";
import axios from "axios";
import styles from "./Experiences.module.css";  // استيراد الـ CSS Module

export default function LatestExperiences() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
  };

  const getFeedbacks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Get-All-Personal-Experiences?PageIndex=1&PageSize=10`
      );
      setFeedbacks(response.data.personalExperiances || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <div>
      <hr className={styles["feedback-line"]} />
      <div className={styles["feedback-container"]}>
        <h2 className={styles["feedback-title"]}>Personal Experiences</h2>
        <Slider {...sliderSettings}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className={styles["feedback-card"]}>
                <div className={styles["feedback-content"]}>
                  <div
                    className={`${styles["feedback-row"]} ${styles["combined-info"]}`}
                  >
                    <Skeleton variant="circular" width={60} height={60} />
                    <Skeleton variant="text" width="70px" />
                  </div>
                  <div className={styles["feedback-text"]}>
                    <Skeleton variant="rounded" width="300px" height="100px" />
                  </div>
                </div>
              </div>
            ))
          ) : feedbacks.length > 0 ? (
            feedbacks.slice(0, 5).map((item, index) => (
              <div key={index} className={styles["feedback-card"]}>
                <div className={styles["feedback-content"]}>
                  <div
                    className={`${styles["feedback-row"]} ${styles["combined-info"]}`}
                  >
                    <Avatar
                      className={styles["active-avatar"]}
                      src={item.imageName || undefined}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        width: 60,
                        height: 60,
                        fontSize: 24,
                      }}
                    >
                      {!item.imageName &&
                        (item.userName?.[0]?.toUpperCase() || "U")}
                    </Avatar>

                    <h3 className={styles.usernamePersonal}>{item.userName}</h3>
                  </div>
                  <div className={styles["feedback-text"]}>
                    <p className={styles["speech-bubble"]}>
                      <span className={styles.quote}>“</span>
                      <span className={styles.text}>{item.content}</span>
                      <span className={`${styles.quote} ${styles.under}`}>”</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No feedback available.</p>
          )}
        </Slider>
        <div className={styles["write-container"]}>
          <Link to="/singlepageexperincse" className={styles["write-btn"]}>
            View more Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}
