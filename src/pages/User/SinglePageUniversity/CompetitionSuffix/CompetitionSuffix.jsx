import React, { useEffect, useState } from "react";
import "./CompetitionSuffix.css";
import { FaHourglassHalf } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../../../../Loader/Loader";

function CompetitionSuffix() {
  const { id } = useParams();
  const [Competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getUniversityInfo = async () => {
    try {
      const response = await axios.get(
        `http://pcpc.runasp.net/University/GetUniversityDetails/${id}`
      );
      setCompetition(response.data.latestPost);
      console.log(response.data.latestPost);
    } catch (error) {
      console.error("Error fetching university info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUniversityInfo();
  }, [id]);

  if (isLoading) return <Loader />;
  if (isLoading || !Competition) return null;

  return (
    <>
      <div className="marquee-container">
        <div className="marquee-wrapper">
          <div className="marquee-content">
            <span>Coming Soon</span>
            <span>Coming Soon</span>
            <span>Coming Soon</span>
          </div>
          <div className="marquee-content">
            <span>Coming Soon</span>
            <span>Coming Soon</span>
            <span>Coming Soon</span>
          </div>
        </div>
      </div>
<div className="container-suffix">
   <div className="headingCompetition">
        <h1>{Competition.title} </h1>
      </div>
      <div className="containerSuffix">
        <section className="aboutSuffix">
          <div className="aboutSuffixImage">
              <img src={Competition.postImageUrl} alt="Competition" />
          </div>
           <div className="aboutSuffixContent">
              <p>{Competition.description}</p>
          </div>
        </section>
      </div>
</div>
     
    </>
  );
}

export default CompetitionSuffix;
/*<div className="container-suffix">
        <div className="compSuffix">
          <div className="compSuffix-text">
            <h1>
              {Competition.title} <FaHourglassHalf />
            </h1>
            <p>{Competition.description}</p>
          </div>
          <div className="compSuffix-image">
           
              <img src={Competition.postImageUrl} alt="Competition" />
            
          </div>
        </div>
      </div> */
