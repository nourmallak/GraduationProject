import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./PhotoSlider.css";

const PhotoSlider = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
     {!loading && images.length > 0 && (
  <Slider {...settings}>
    {images.map((image) => (
      <div key={image.id}>
        <div className="image-container-slider">
          <img
            src={image.imageName}
            alt={`Slide ${image.id}`}
            className="slider-image-slider"
          />
        </div>
      </div>
    ))}
  </Slider>
)}

    </div>
  );
};

export default PhotoSlider;
