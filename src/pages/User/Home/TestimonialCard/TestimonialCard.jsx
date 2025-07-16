import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TestimonialCard.css";
import DEFAULT_IMAGE from '../../../../images/image/newsLeast.jpeg';

const TestimonialCard = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/Posts/Get-Latest-Post`
      );
      setPost(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) return <p className="loading-text">Loading...</p>;
  if (!post) return <p className="no-post-text">No news available</p>;

  const {
    postId,
    title,
    description,
    postImage,
    posterName,
    createdAt,
  } = post;

  const maxLength = 120;
  const isLongText = description.length > maxLength;
  const displayDescription = isLongText
    ? description.substring(0, maxLength) + "..."
    : description;

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="latest-news-section">
      <h2 className="latest-news-title">Latest News</h2>

      <div className="news-card" key={postId}>
        <div className="news-image-wrapper">
          <img
            className="news-image"
            src={postImage ? postImage : DEFAULT_IMAGE}
            alt={title}
            onError={(e) => (e.target.src = DEFAULT_IMAGE)}
          />
        </div>
        <div className="news-content" style={{ direction: "ltr", textAlign: "left" }}>
          <h3 className="news-title">{title}</h3>
          <p className="news-description">
            {displayDescription}
            {isLongText && (
              <button
                className="read-more-btn"
                onClick={() => navigate('/community')}
              >
                Read More
              </button>
            )}
          </p>
          <div className="news-footer">
            <span className="news-author">By {posterName}</span>
            <span className="news-date">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
