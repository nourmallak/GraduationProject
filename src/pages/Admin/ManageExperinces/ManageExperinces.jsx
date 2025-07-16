import React, { useEffect, useState } from "react";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "react-bootstrap/Pagination";
import "./ManageExperinces.css";
import Loader from "../../../Loader/Loader";

export default function ManageExperirnces() {
  const [searchName, setSearchName] = useState("");
  const [personalData, setPersonalData] = useState([]);
  const [filterState, setFilterState] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
   const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  const getReviewedData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Get-All-Personal-Experiences?PageIndex=1&PageSize=40`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user token")}`,
          },
        }
      );
      return response.data.personalExperiances.map((item) => ({
        ...item,
        state: "Accept",
      }));
    } catch (e) {
      console.log("Error fetching reviewed data:", e);
      return [];
    }
    finally {
      setIsLoading(false); 
    }
  };

  const getUnReviewedData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Get-UnReviewed-Personal-Experience?PageIndex=1&PageSize=5`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user token")}`,
          },
        }
      );
      return response.data.personalExperiances.map((item) => ({
        ...item,
        state: "Review",
      }));
    } catch (e) {
      console.log("Error fetching unreviewed data:", e);
      return [];
    }
    finally {
      setIsLoading(false); 
    }
  };

  const getAllData = async () => {
    const reviewed = await getReviewedData();
    const unreviewed = await getUnReviewedData();
    setPersonalData([...reviewed, ...unreviewed]);
  };

  const searchByName = async (name) => {
    if (!name.trim()) {
      getAllData();
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/PersonalExperiences/Search-Personal-Experiences-By-Username?userName=${name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user token")}`,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        const results = response.data.map((item) => ({
          ...item,
          state: item.isAccepted ? "Accept" : "Review",
        }));
        setPersonalData(results);
      } else {
        setPersonalData([]);
      }
    } catch (e) {
      Swal.fire("Error!", "Search failed.", "error");
    }
    finally {
      setIsLoading(false); 
    }
  };

  const deleteDataPersonal = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API}/PersonalExperiences/Delete-Personal-Experience-By-Admin/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user token")}`,
              },
            }
          );
          Swal.fire("Deleted!", "Deleted successfully", "success");
          getAllData();
        } catch (e) {
          Swal.fire("Error!", "An error occurred during the deletion process.", "error");
        }
      }
    });
  };

  const handleStateChange = async (id, newState) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${newState === "Accept" ? "accept" : "reject"} this experiment?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#f8800f",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (result.isConfirmed) {
        const updatedData = personalData.map((item) =>
          item.personalExperienceId === id ? { ...item, state: newState } : item
        );
        setPersonalData(updatedData);

        await axios.put(
          `${import.meta.env.VITE_API}/PersonalExperiences/Accept-Personal-Experiences-By-Admin/${id}`,
          { state: newState },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("user token")}`,
            },
          }
        );
        Swal.fire("Updated!", "The experiment status was successfully updated.", "success");
      }
    } catch (e) {
      Swal.fire("Error!", "An error occurred while changing the status.", "error");
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchByName(searchName);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchName]);

  const filteredData = personalData
    .filter((item) => (filterState === "All" ? true : item.state === filterState))
    .sort((a, b) => (a.state === "Review" ? -1 : 1));

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIdx, startIdx + itemsPerPage);
   if (isLoading) return <Loader />;
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Manage Personal Experiences</h2>
      </div>

      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <select
            id="filterState"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="select-input"
          >
            <option value="All">All</option>
            <option value="Accept">Accepted</option>
            <option value="Review">Review</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Content</th>
            <th>State</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((personal, index) => (
            <tr key={personal.personalExperienceId}>
              <th>{startIdx + index + 1}</th>
              <td>{personal.userName}</td>
              <td>{personal.content}</td>
              <td>
                {personal.state === "Accept" ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>Accepted</span>
                ) : (
                  <select
                    value={personal.state}
                    onChange={(e) =>
                      handleStateChange(personal.personalExperienceId, e.target.value)
                    }
                    className="select-input"
                  >
                    <option value="Review">Review</option>
                    <option value="Accept">Accept</option>
                  </select>
                )}
              </td>
              <td>
                <div className="actionsdashManage">
                  <RiDeleteBin5Fill
                    onClick={() => deleteDataPersonal(personal.personalExperienceId)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Component */}
      <div className="pagination-container" style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
}
