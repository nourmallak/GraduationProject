import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLinkedin, FaGithub, FaTrash, FaEllipsisV } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import "./ViewDetailsUniversity.css";
import Loader from "../../../Loader/Loader";
import SubAdminUniversity from './SubAdminUniversity';


export function ViewDetailsUniversity() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
  
  const token = localStorage.getItem("user token");

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/University/GetUniversityDetails/${id}`);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.universityImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.universityImages.length - 1 : prevIndex - 1
    );
  };

  const handleDeleteImage = async (imageId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to delete this image?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#f8800f", 
      cancelButtonColor: "red", 
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: 'custom-swal-icon'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API}/api/UniversityImages/Delete-UniversityImage/${imageId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Deleted!', 'Image has been deleted.', 'success');
          getData();
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete image.', 'error');
        }
      }
    });
  };

  const handleDeleteAllImages = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete ALL university images!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API}/api/UniversityImages/universities/${id}/images/delete-all`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          Swal.fire('Deleted!', 'All images have been deleted.', 'success');
          getData();
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete all images.', 'error');
        }
      }
    });
  };

  const handleDeleteSubAdmin = async (adminId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the Sub Admin!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: 'custom-swal-icon'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_API}/Auths/Remove-Sub-Admin/${adminId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          Swal.fire('Deleted!', 'Sub Admin has been deleted.', 'success');
          getData();
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete Sub Admin.', 'error');
        }
      }
    });
  };

   if (isLoading) return <Loader />;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow-lg rounded-4 p-4 border-0">
          
            <div className="row g-4 align-items-center">
              <div className="col-md-4 text-center">
                <img
                  src={data.logoUrl}
                  alt="University Logo"
                  className="img-fluid rounded-circle border"
                  style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
              <div className="col-md-8">
                <h2 className="fw-bold mb-3">{data.name} ({data.shortName})</h2>
                <p className="text-muted mb-2"><strong>Description:</strong> {data.description || "No description provided."}</p>
                <p className="text-muted mb-2"><strong>Location:</strong> {data.location || "Not specified"}</p>
                <p className="text-muted mb-2">
                  <strong>Website:</strong>{" "}
                  <Link to={data.url} target="_blank" className="text-decoration-none text-primary">
                    {data.url}
                  </Link>
                </p>
                <p className="text-muted mb-0"><strong>Phone Number:</strong> {data.phoneNumber || "N/A"}</p>
              </div>
            </div>

            
            

            <SubAdminUniversity />

           
           

          </div>
        </div>
      </div>
    </div>
  );
}
