import React, { useEffect, useState } from "react";
import "./SinglePageExperincse.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import axios from "axios";
import Loader from "../../../Loader/Loader";

const truncateText = (text, isExpanded) => {
  const wordLimit = 20;
  const words = text.split(" ");
  return words.length > wordLimit
    ? isExpanded
      ? text
      : words.slice(0, wordLimit).join(" ") + "..."
    : text;
};

export default function SinglePageExperiences() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversityId, setSelectedUniversityId] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [expandedCardIndex, setExpandedCardIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const getUniversities = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/University/GetAllUniversities`
      );
      setUniversities(res.data);
    } catch (e) {
      console.error("Error fetching universities:", e);
    }
    finally {
      setIsLoading(false); 
    }
  };

  const getAllExperiences = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Get-All-Personal-Experiences?PageIndex=1&PageSize=1000`
      );
      setExperiences(res.data.personalExperiances);
    } catch (e) {
      console.error("Error fetching experiences:", e);
    }
    finally {
      setIsLoading(false); 
    }
  };

  const getExperiencesByUniversity = async (universityId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Get-All-Personal-Experiences-By-University/${universityId}?pageIndex=1&pageSize=100`
      );
      setExperiences(res.data.personalExperiances || []);
    } catch (e) {
      console.error("Error fetching experiences by university:", e);
    }
    finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getUniversities();
    getAllExperiences();
    window.scrollTo(0, 0);
  }, []);

  const handleUniversityClick = (id) => {
    if (selectedUniversityId === id) {
      setSelectedUniversityId(null);
      getAllExperiences();
    } else {
      setSelectedUniversityId(id);
      getExperiencesByUniversity(id);
    }
  };

  const toggleExpand = (index) => {
    setExpandedCardIndex(expandedCardIndex === index ? null : index);
  };
  
     if (isLoading) return <Loader />;

  return (
    <div className="refined-wrapper">
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation
        autoplay={{ delay: 3000 }}
        modules={[Navigation, Autoplay]}
        className="refined-slider"
      >
        {universities.map((uni) => (
          <SwiperSlide key={uni.universityId} className="refined-slide">
            <img
              src={uni.imageUrl}
              alt={uni.name}
              onClick={() => handleUniversityClick(uni.universityId)}
              className={`refined-uni-img ${
                selectedUniversityId === uni.universityId ? "selected" : ""
              }`}
            />
            <p className="refined-uni-name">{uni.shortName}</p>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="refined-experiences-grid">
        {experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <div
              key={index}
              className={`refined-card ${
                expandedCardIndex === index ? "expanded" : ""
              }`}
            >
              <div className="refined-user-info">
                <img
                  src={exp.imageName}
                  alt={exp.userName}
                  className="refined-user-avatar"
                />
                <div>
                  <h3>{exp.userName}</h3>
                  <span>{exp.universityShortName}</span>
                </div>
              </div>

              <div className="refined-text-container">
                <p
                  className={`refined-text ${
                    expandedCardIndex === index ? "expanded" : ""
                  }`}
                >
                  {truncateText(exp.content, expandedCardIndex === index)}
                </p>
                {exp.content?.split(" ").length > 20 && (
                  <span
                    className="refined-read-toggle"
                    onClick={() => toggleExpand(index)}
                  >
                    {expandedCardIndex === index ? "Read Less" : "Read More"}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="refined-no-data">
            No experiences available to display
          </div>
        )}
      </div>
    </div>
  );
}
