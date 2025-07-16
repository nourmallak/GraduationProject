import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import "./SliderImage.css";

const SliderImage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("user token");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://pcpc.runasp.net/MainPageImage/get");
        if (Array.isArray(response.data) && response.data.length > 0) {
          setImages(response.data);
        } else {
          console.error("No images found in response");
        }
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [token]);

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
        icon: 'custom-swal-icon'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://pcpc.runasp.net/MainPageImage/delete/${imageId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages(images.filter((img) => img.id !== imageId));
        Swal.fire("Deleted!", "Image has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting image:", error);
        Swal.fire("Error", "Failed to delete image.", "error");
      }
    }
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
        icon: 'custom-swal-icon'
      }
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete("http://pcpc.runasp.net/MainPageImage/delete-all-images", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setImages([]);
        Swal.fire("Deleted!", "All images have been deleted.", "success");
      } catch (error) {
        console.error("Error deleting all images:", error);
        Swal.fire("Error", "Failed to delete all images.", "error");
      }
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: true,
  };

  return (
    <div className="sliderPh">
      {images.length > 0 && (
        <div className="delete-all-container">
          <button className="delete-all-button" onClick={handleDeleteAll}>
            Delete All Images <FaTrash style={{ marginLeft: "8px" }} />
          </button>
        </div>
      )}

      {!loading && images.length > 0 && (
        <Slider {...settings}>
          {images.map((image) => (
            <div key={image.id}>
              <div
                className="image-container-slider"
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              >
                <img
                  src={image.imageName}
                  alt={`Slide ${image.id}`}
                  className="slider-image-slider"
                />
                <button
                  className="delete-icon-imagesDsh"
                  onClick={() => handleDelete(image.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default SliderImage;
