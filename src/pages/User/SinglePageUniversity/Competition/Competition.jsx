import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Competition.css';
import axios from 'axios';
import Loader from '../../../../Loader/Loader';
import { UserContext } from '../../../../context/Context';
import { jwtDecode } from 'jwt-decode';

export default function Competition() {
  const { id } = useParams();
  const [competition, setCompetition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(0);
  const userRole = localStorage.getItem('userRole');
  const { universityInfo } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("user token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        setCurrentUserId(parseInt(userId));
      } catch (e) {
        console.error("Token decode error:", e);
      }
    }
  }, []);

  const isCurrentSubAdminOfUniversity = () => {
    if (userRole !== "Sub_Admin" || !universityInfo?.subAdmins) return false;
    return universityInfo.subAdmins.some((admin) => admin.id === currentUserId);
  };

  useEffect(() => {
    const getUniversityInfo = async () => {
      try {
        const response = await axios.get(
          `http://pcpc.runasp.net/University/GetUniversityDetails/${id}`
        );
        setCompetition(response.data.lastCompetition);
      } catch (error) {
        console.error("Error fetching university info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUniversityInfo();
  }, [id]);

  if (isLoading) return <Loader />;

  return (
    <>
      {competition ? (
        <section className="competition-section">
          <h2 className="section-title"> Latest Competition </h2>

          <div className="competition-container">
            <div className="competition-image-container">
              <img
                src={competition.competitionImageUrl}
                alt={competition.name}
                className="competition-main-image"
              />
            </div>

            <div className="competition-text">
              <h3>{competition.name}</h3>
              <p>{competition.description}</p>
              <Link to="#" className="btn-primary-Copm">View Details</Link>
            </div>
          </div>

          <div className="competition-footer">
            <Link to={`/universitycompetitions/${id}`} className="btn-secondary-Copm">See More Competitions</Link>
          </div>
        </section>
      ) : (
        <>
          {isCurrentSubAdminOfUniversity() && (
            <div className='container'>
              <div className="no-competition-message">
                <Link
                  to={`/universitycompetitions/${id}`}
                  className="btn-secondary-Copm"
                >
                  Go to University Archive
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
