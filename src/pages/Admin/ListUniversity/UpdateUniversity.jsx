import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateUniversity.css";
import Loader from "../../../Loader/Loader";

export default function UpdateUniversity() {
  const { id } = useParams();
  const [universityData, setUniversityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("user token");
    const navigate = useNavigate();


  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/University/GetUniversityDetails/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setUniversityData(response.data);
        setLoading(false);
      } catch (error) {
        Swal.fire("Error", "Failed to fetch university data", "error");
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [id]);

  const updateUniversity = async () => {
    try {
      const formData = new FormData();
      formData.append("Name", universityData.name || "");
      formData.append("Description", universityData.description || "");
      formData.append("Location", universityData.location || "");
      formData.append("Gmail", universityData.
        shortName || "");
      formData.append("PhoneNumber", universityData.phoneNumber || "");
      formData.append("Url", universityData.url || "");

      if (universityData.logoFile instanceof File) {
        formData.append("Logo", universityData.logoFile);
      }

      if (universityData.imageFile instanceof File) {
        formData.append("ImageName", universityData.imageFile);
      }

      await axios.put(
        `${import.meta.env.VITE_API}/University/UpdateUniversity/${id}`,
        formData
        ,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      Swal.fire("Success", "University updated successfully", "success");
      
       navigate(`/singleuniversity/${id}`);

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update university", "error");
    }
  };

  if (loading) return <Loader />;
  if (!universityData) return <div className="loading-text">No data found</div>;

  return (
    <div className="update-container-university">
  <div className="update-wrapper-university">
    <h2 className="update-title-university">Edit University</h2>

    <div className="update-form-university">
      {/* العمود الأيسر */}
      <div>
        <div className="form-group-university">
          <label>Name:</label>
          <input
            type="text"
            value={universityData.name || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, name: e.target.value })
            }
          />
        </div>

        <div className="form-group-university">
          <label>Description:</label>
          <input
            type="text"
            value={universityData.description || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, description: e.target.value })
            }
          />
        </div>

        <div className="form-group-university">
          <label>Location:</label>
          <input
            type="text"
            value={universityData.location || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, location: e.target.value })
            }
          />
        </div>

        <div className="form-group-university">
          <label>
          shortName</label>
          <input
            type="text"
            value={universityData.
              shortName || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, 
                shortName: e.target.value })
            }
          />
        </div><div className="form-group-university">
          <label>Phone Number:</label>
          <input
            type="text"
            value={universityData.phoneNumber || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, phoneNumber: e.target.value })
            }
          />
        </div>
      </div>

      {/* العمود الأيمن */}
      <div>
        

        <div className="form-group-university">
          <label>Website URL:</label>
          <input
            type="text"
            value={universityData.url || ""}
            onChange={(e) =>
              setUniversityData({ ...universityData, url: e.target.value })
            }
          />
        </div>

        <div className="form-group-university">
  <div className="logo-card">
    <h4>Current Logo</h4>
    {universityData.logoUrl ? (
      <img
        src={universityData.logoUrl}
        alt="Current University Logo"
      />
    ) : (
      <span style={{ color: "#9ca3af", fontSize: "14px" }}>No logo available</span>
    )}
  </div>
</div>


        <div className="form-group-university">
          <label>New Logo:</label>
          <input
            type="file"
            onChange={(e) =>
              setUniversityData({ ...universityData, logoFile: e.target.files[0] })
            }
          />
        </div>

        <div className="form-group-university">
          <label>New Cover Image:</label>
          <input
            type="file"
            onChange={(e) =>
              setUniversityData({ ...universityData, imageFile: e.target.files[0] })
            }
          />
        </div>
      </div>
    </div>

    <div className="update-actions-university">
      <button className="save-btn-university" onClick={updateUniversity}>Save Changes</button>
    </div>
  </div>
</div>


  );
}
