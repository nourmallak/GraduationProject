import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaLinkedin, FaGithub, FaTrash, FaEllipsisV } from "react-icons/fa";
import Dropdown from 'react-bootstrap/Dropdown';
import "./ViewDetailsUniversity.css";
import Loader from "../../../Loader/Loader";

export function ViewDetailsArchiveUniversity() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();

  const token = localStorage.getItem("user token");

  const getData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/University/GetArchiveUniversityDetails/${id}`);
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
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
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

  const handleDeleteSubAdmin = async (adminId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will permanently delete the Sub Admin!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
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
            {/* University Information */}
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

            {/* University Gallery */}
            {data.universityImages && data.universityImages.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-3">University Gallery</h4>
                <div className="gallery-wrapper">
                  <button onClick={handlePrev} className="gallery-nav left">❮</button>

                  <div className="gallery-image-container">
                    <div className="image-hover-wrapper">
                      <img
                        src={data.universityImages[currentIndex]?.imageName || "default_image_url.png"}
                        alt={`University ${currentIndex}`}
                        className="gallery-image"
                      />
                      <button
                        className="gallery-delete-btn"
                        onClick={() => handleDeleteImage(data.universityImages[currentIndex]?.universityImagesId)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <button onClick={handleNext} className="gallery-nav right">❯</button>
                </div>
              </div>
            )}

            {/* SubAdmins Section */}
            {data.subAdmins && data.subAdmins.length > 0 && (
              <div className="mt-5">
                <h4 className="mb-3">Sub Admins</h4>

                <div className="subadmin-slider-container">
                  <button
                    className="slider-nav-button left"
                    onClick={() =>
                      document.getElementById("subadmin-slider").scrollBy({ left: -300, behavior: "smooth" })
                    }
                  >
                    ❮
                  </button>

                  <div
                    className="subadmin-slider"
                    id="subadmin-slider"
                    style={{ overflowX: "auto", scrollBehavior: "smooth" }}
                  >
                    {data.subAdmins.map((admin, index) => (
                      <div key={index} className="subadmin-card position-relative">
                        {/* زر الثلاث نقاط على اليسار */}
                        <Dropdown className="position-absolute top-0 end-0 m-2">
                          <Dropdown.Toggle
                            variant="light"
                            id="dropdown-basic"
                            className="border-0"
                            style={{ background: "none", boxShadow: "none" }}
                          >
                            <FaEllipsisV />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => navigate(`/dashboard/viewprofile/${admin.id}`)}>
                              View Profile
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDeleteSubAdmin(admin.id)}>
                              Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>

                        <img src={admin.imageUrl} alt={admin.userName} />
                        <h5>{admin.userName}</h5>
                        <p>{admin.description || "No description provided."}</p>
                        <div className="d-flex justify-content-center gap-3">
                          <Link to={admin.linkedInLink || "#"} target="_blank">
                            <FaLinkedin size={24} className={admin.linkedInLink ? "" : "text-muted"} />
                          </Link>
                          <Link to={admin.githubLink || "#"} target="_blank">
                            <FaGithub size={24} className={admin.githubLink ? "" : "text-muted"} />
                          </Link>
                        </div>
                        <Link
                          to={`mailto:${admin.email}`}
                          className="btn btn-sm mt-3"
                          style={{ backgroundColor: "#007bff", color: "#fff" }}
                        >
                          Message
                        </Link>
                      </div>
                    ))}
                  </div>

                  <button
                    className="slider-nav-button right"
                    onClick={() =>
                      document.getElementById("subadmin-slider").scrollBy({ left: 300, behavior: "smooth" })
                    }
                  >
                    ❯
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
export default ViewDetailsArchiveUniversity;
