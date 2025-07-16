import React, { useEffect, useState } from "react";
import { FaArchive, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GrFormView } from "react-icons/gr";
import { MdAddPhotoAlternate, MdOutlineEdit } from "react-icons/md";
import { LuArchiveX } from "react-icons/lu";
import { IoIosUndo } from "react-icons/io"; // Icon for unarchive action
import "./ListUniversity.css";
import Loader from "../../../Loader/Loader";

export default function ListUniversity() {
  const [searchUniversity, setSearchUniversity] = useState("");
  const [listData, setListData] = useState([]);
  const [archivedData, setArchivedData] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("user token");

  const getData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/University/GetAllUniversitiesforAdmin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setListData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getArchivedData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/University/GetAllArchiveUniversities`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setArchivedData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();

    if (localStorage.getItem("showArchived") === "true") {
      setShowArchived(true);
      getArchivedData();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("showArchived", showArchived);
  }, [showArchived]);

  const deleteUniversity = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API}/University/DeleteUniversity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListData((prevData) =>
          prevData.filter((item) => item.universityId !== id)
        );
        await Swal.fire("Deleted!", "Deleted successfully", "success");
      } catch (e) {
        await Swal.fire(
          "Error!",
          "An error occurred during the deletion process.",
          "error"
        );
      }
    }
  };

  const archiveUniversity = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this data once archived!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, archive it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API}/University/archive/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setListData((prevData) =>
          prevData.filter((item) => item.universityId !== id)
        );
        setArchivedData((prevData) => [
          ...prevData,
          ...listData.filter((item) => item.universityId === id),
        ]);
        await Swal.fire(
          "Archived!",
          "The university has been archived successfully.",
          "success"
        );
      } catch (e) {
        await Swal.fire(
          "Error!",
          "An error occurred during the archiving process.",
          "error"
        );
      }
    }
  };

  const unarchiveUniversity = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will move this university back to the active list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, unarchive it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API}/University/UnArchive/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArchivedData((prevData) =>
          prevData.filter((item) => item.universityId !== id)
        );
        setListData((prevData) => [
          ...prevData,
          ...archivedData.filter((item) => item.universityId === id),
        ]);
        await Swal.fire(
          "Unarchived!",
          "The university has been moved back to active universities.",
          "success"
        );
      } catch (e) {
        await Swal.fire(
          "Error!",
          "An error occurred during the unarchiving process.",
          "error"
        );
      }
    }
  };

  const filteredUniversities = listData.filter((university) =>
    university.name.toLowerCase().includes(searchUniversity.toLowerCase())
  );

  const filteredArchivedUniversities = archivedData.filter((university) =>
    university.name.toLowerCase().includes(searchUniversity.toLowerCase())
  );

  const toggleArchivedView = () => {
    if (!showArchived) {
      getArchivedData();
    }
    setShowArchived(!showArchived);
  };
  if (isLoading) return <Loader />;

  return (
    <div className="university-table-container">
      <div className="university-header">
        <h2 className="university-title-dash">
          {showArchived ? "Archived Universities" : "University List"}
        </h2>
        {!showArchived && (
          <Link to="/dashboard/adduniversity">
            <button className="university-add-btn">
              <FaPlus /> Add
            </button>
          </Link>
        )}
      </div>

      <div className="university-search-wrapper">
        <div className="university-search-box">
          <FaSearch className="university-search-icon" />
          <input
            type="text"
            placeholder="Search by name university"
            value={searchUniversity}
            onChange={(e) => setSearchUniversity(e.target.value)}
            className="university-search-input"
          />
        </div>
        <button
          onClick={toggleArchivedView}
          className="university-toggle-archived-btn"
        >
          {showArchived
            ? "Show All Universities"
            : "Show Archived Universities"}
        </button>
      </div>

      <table className="university-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {(showArchived
            ? filteredArchivedUniversities
            : filteredUniversities
          ).map((university, index) => (
            <tr key={university.universityId}>
              <td>{index + 1}</td>
              <td>
                <div className="university-name-cell">
                  <img
                    src={university.imageUrl}
                    className="university-logo"
                    alt="Logo"
                  />
                  <span>{university.name}</span>
                </div>
              </td>
              <td>{university.phoneNumber}</td>
              <td>{university.location}</td>
              <td>
                <div className="university-actions">
                  <RiDeleteBin5Fill
                    className="action-icon delete-icon"
                    title="delete"
                    onClick={() => deleteUniversity(university.universityId)}
                  />
                  {/* عرض أيقونة التعديل فقط إذا كانت الجامعة غير مؤرشفة */}
                  {/*    {!showArchived && (
                    <Link
                      to={`/dashboard/edituniversity/${university.universityId}`}
                    >
                     <button className="university-edit-btn" title="edit">
                        <MdOutlineEdit />
                      </button>
                    </Link>
                  )}
                  <Link
                    to={
                      showArchived
                        ? `/dashboard/viewdetailsarchiveuniversity/${university.universityId}`
                        : `/dashboard/viewdetailsuniversity/${university.universityId}`
                    }
                  >
                    <button className="university-view-btn" title="view">
                      <GrFormView />
                    </button>
                  </Link>
                  <Link to={`/dashboard/addimages/${university.universityId}`}>
                    <button
                      className="university-add-img-btn"
                      title="Add Images"
                    >
                      <MdAddPhotoAlternate />
                    </button>
                  </Link>*/}
                  {showArchived ? (
                    <IoIosUndo
                      className="action-icon unarchive-icon"
                      title="unarchive"
                      onClick={() =>
                        unarchiveUniversity(university.universityId)
                      }
                    />
                  ) : (
                    <FaArchive
                      className="action-icon archive-icon"
                      title="Archive"
                      onClick={() => archiveUniversity(university.universityId)}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
