import React, { useContext, useEffect, useState } from "react";
import "./AboutUniversity.css";
import { CgWebsite } from "react-icons/cg";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6"; 

import { BsFillTelephoneFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { jwtDecode } from "jwt-decode";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../../Loader/Loader";
import Swal from "sweetalert2";
import { MdAddPhotoAlternate } from "react-icons/md";
import { UserContext } from "../../../../context/Context";

export default function AboutUniversity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("user token");
  const [images, setImages] = useState([]);
  const {universityInfo, setUniversityInfo} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("user token");
    if (token) {
      const decoded = jwtDecode(token);
      const userRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
      setRole(userRole);
      setCurrentUserId(parseInt(userId));
    }
  }, []);

  const getImages = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API
        }/api/UniversityImages/Get-UniversityImages/${id}`
      );
      setImages(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUniversityInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/University/GetUniversityDetails/${id}`
      );
      setUniversityInfo(response.data);
    } catch (error) {
      console.error("Error fetching university info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getImages();
    getUniversityInfo();
  }, [id]);

  const isCurrentSubAdminOfUniversity = () => {
    if (role !== "Sub_Admin" || !universityInfo?.subAdmins) return false;
    return universityInfo.subAdmins.some((admin) => admin.id === currentUserId);
  };

  const handleDeleteAll = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete ALL images?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red",
      confirmButtonText: "Yes, delete All!",
      cancelButtonText: "Cancel",
      customClass: {
        icon: "custom-swal-icon",
      },
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_API
          }/api/UniversityImages/universities/${id}/images/delete-all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setImages([]);
        Swal.fire("Deleted!", "All images have been deleted.", "success");
      } catch (error) {
        console.error("Error deleting all images:", error);
        Swal.fire("Error", "Failed to delete all images.", "error");
      }
    }
  };

 const handleDelete = async (imageId) => {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to delete this image?",
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

  if (confirm.isConfirmed) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API}/api/UniversityImages/Delete-UniversityImage/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // تحديث القائمة بدون ريفرش
      setImages((prevImages) =>
        prevImages.filter((img) => img.universityImagesId !== imageId)
      );
      Swal.fire("Deleted!", "Image has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting image:", error);
      Swal.fire("Error", "Failed to delete image.", "error");
    }
  }
};


  const handleAddImage = () => {
    navigate(`/add-university-image/${id}`);
  };

  if (isLoading) return <Loader />;

  return (
    <div
      className="aboutUni containerNav"
      style={{
        backgroundImage: universityInfo?.imageName
          ? `linear-gradient(rgba(255, 252, 245, 0.9), rgba(255, 252, 245, 0.9)), url(${universityInfo.imageName})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {isCurrentSubAdminOfUniversity() && (
        <div className="admin-buttons">
          <button
            onClick={() => navigate(`/edituniversity/${id}`)}
            title="Edit"
          >
            <FaEdit />
          </button>
          <button onClick={handleDeleteAll} title="Delete All Images">
            <FaTrashAlt />
          </button>
          <button onClick={handleAddImage} title="Add Image">
            <MdAddPhotoAlternate />
          </button>
        </div>
      )}

      {universityInfo && (
        <div className="about-text">
          <div className="about-header">
            <h1 data-text={universityInfo.name}>{universityInfo.name}</h1>
          </div>
          <p>{universityInfo.description}</p>
        </div>
      )}

      <Swiper
        className="swiperAboutUniversity"
        modules={[Autoplay]}
        spaceBetween={20}
        loop={true}
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1200: { slidesPerView: 3 },
        }}
      >
        {images.length > 0 ? (
          images.map((image, index) => (
            <SwiperSlide key={index} className="sliderAbout">
              <div className="aboutSlider">
                {isCurrentSubAdminOfUniversity() && (
                  <button
                    className="delete-image-btn-about"
                    title="Delete Image"
                    onClick={() => handleDelete(image.universityImagesId)}
                  >
                    <FaTrashAlt />
                  </button>
                )}
                <img
                  src={image.imageName}
                  alt={`University Image ${index + 1}`}
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p></p>
        )}
      </Swiper>

      <div className="about-boxes">
        <div className="box">
          <h3>
            <FaLocationDot />
          </h3>
          <p>{universityInfo?.location || "Location Not Available"}</p>
        </div>
        <div className="box">
          <h3>
            <CgWebsite />
          </h3>
          {universityInfo?.url ? (
            <p>
              <a
                href={universityInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Visit Website
              </a>
            </p>
          ) : (
            <p>Website Not Available</p>
          )}
        </div>
        <div className="box">
          <h3>
            <BsFillTelephoneFill />
          </h3>
          <p>{universityInfo?.phoneNumber || "Phone Not Available"}</p>
        </div>
      </div>
    </div>
  );
}
