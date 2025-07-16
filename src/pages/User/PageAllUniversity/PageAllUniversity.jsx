import React, { useEffect, useState } from "react";
import "./PageAllUniversity.css";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../../Loader/Loader";

export default function University() {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/University/GetAllUniversities`);
      setListData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
   
    return (
      
        <Loader />
    );
  }

  return (
    <div className="university-section" id="university-section">
      <h2 className="university-title">Universities</h2>
      <div className="university-grid">
        {listData.map((university) => (
          <div className="university-card" key={university.universityId}>
            <div className="university-image-container">
              <img className="university-image" src={university.imageUrl} alt={university.name} />
              <Link to={`/singleuniversity/${university.universityId}`}>
                <div className="university-overlay">
                  <FaSearch className="university-search-icon" />
                  <p>See more</p>
                </div>
              </Link>
            </div>
            <div className="university-info">
              <p className="university-name">{university.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
