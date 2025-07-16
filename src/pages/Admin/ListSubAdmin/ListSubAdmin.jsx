import React, { useEffect, useState } from "react";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { GrFormView } from "react-icons/gr";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ListSubAdmin.css";
import axios from "axios";
import Swal from "sweetalert2";
import Pagination from "react-bootstrap/Pagination";
import Loader from "../../../Loader/Loader";

export default function ListSubAdmin() {
  const [searchName, setSearchName] = useState("");
  const [searchUniversity, setSearchUniversity] = useState("");
  const [listData, setListData] = useState([]);
  const [isViewingUsers, setIsViewingUsers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const url = isViewingUsers
        ? `${
            import.meta.env.VITE_API
          }/Auths/Get-All-Users?PageIndex=${currentPage}&PageSize=7`
        : `${
            import.meta.env.VITE_API
          }/Auths/Get-Sub-Admin?PageIndex=${currentPage}&PageSize=7`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user token")}`,
        },
      });

      const data = isViewingUsers
        ? response.data.subAdminsDtos
        : response.data.subAdminsDtos;
      setListData(data || []);
      setTotalCount(response.data.totalSubAdmins || 0);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [isViewingUsers, currentPage]);

  const deletSubAdmin = async (id) => {
    Swal.fire({
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API}/Auths/Remove-Sub-Admin/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user token")}`,
              },
            }
          );
          Swal.fire("Deleted!", "Deleted successfully", "success");
          getData();
        } catch (e) {
          Swal.fire("Error!", "An error occurred during the process.", "error");
          console.log("Error deleting data:", e);
        }
      }
    });
  };

  const promoteToUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will convert the advisor to a normal user.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, promote",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${
              import.meta.env.VITE_API
            }/Auths/Promote-SubAdmin-To-User?userId=${id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user token")}`,
              },
            }
          );
          Swal.fire("Success!", "Operation completed successfully.", "success");
          getData();
        } catch (error) {
          Swal.fire("Error!", "An error occurred while promoting.", "error");
          console.log("Promotion error:", error);
        }
      }
    });
  };

  const promoteToSubAdmin = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will promote the user to SubAdmin.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, promote",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${
              import.meta.env.VITE_API
            }/Auths/Promote-User-To-SubAdmin?userId=${id}`,
            null,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("user token")}`,
              },
            }
          );
          Swal.fire("Success!", "Operation completed successfully.", "success");
          getData();
        } catch (error) {
          Swal.fire("Error!", "An error occurred while promoting.", "error");
          console.log("Promotion to SubAdmin error:", error);
        }
      }
    });
  };

  const filteredData = listData.filter(
    (advisor) =>
      (advisor.name || "").toLowerCase().includes(searchName.toLowerCase()) &&
      (advisor.universityName || "")
        .toLowerCase()
        .includes(searchUniversity.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleToggleView = () => {
    setIsViewingUsers(!isViewingUsers);
    setCurrentPage(1);
  };
  if (isLoading) return <Loader />;
  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">
          {isViewingUsers ? "User List" : "SubAdmin List"}
        </h2>

        {!isViewingUsers && (
          <Link to="/dashboard/addsubadmin">
            <button className="add-btn">
              <FaPlus /> Add
            </button>
          </Link>
        )}
      </div>

      <div className="search-container">
        <div className="se-internal">
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
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by university"
              value={searchUniversity}
              onChange={(e) => setSearchUniversity(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button onClick={handleToggleView} className="toggle-view-btn">
          {isViewingUsers ? "Show SubAdmins" : "Show All Users"}
        </button>
      </div>

      <table className="table-listsubadmin">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>University Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((advisor, index) => (
            <tr key={advisor.id}>
              <th>{index + 1 + (currentPage - 1) * itemsPerPage}</th>
              <td>
                <div>
                  <img
                    src={advisor.image || "default.jpg"}
                    className="logoImg"
                    alt="Logo"
                  />
                  <span>{advisor.name}</span>
                </div>
              </td>
              <td>{advisor.email}</td>
              <td>{advisor.universityName}</td>
              <td>{advisor.role || "No role"}</td>
              <td>
                <div className="actionsdash">
                  {isViewingUsers ? (
                    advisor.role === "User" && (
                      <MdOutlinePublishedWithChanges
                        title="Promote to SubAdmin"
                        onClick={() => promoteToSubAdmin(advisor.id)}
                        style={{ cursor: "pointer", color: "blue" }}
                      />
                    )
                  ) : (
                    <>
                      <RiDeleteBin5Fill
                        onClick={() => deletSubAdmin(advisor.id)}
                      />
                      <Link to={`/dashboard/viewprofile/${advisor.id}`}>
                        <GrFormView />
                      </Link>
                      <MdOutlinePublishedWithChanges
                        title="Promote to User"
                        onClick={() => promoteToUser(advisor.id)}
                        style={{ cursor: "pointer", color: "green" }}
                      />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <Pagination
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination.First onClick={() => handlePageChange(1)} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} />
        </Pagination>
      )}
    </div>
  );
}
