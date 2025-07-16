import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./AddImages.css";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AddImages() {
  const { register, handleSubmit, reset } = useForm();
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("user token");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setSuccess(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
    setSuccess(false);
  };

  const onSubmit = async (data) => {
    const files = Array.from(data.images);

    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setUploading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API}/api/UniversityImages/universities/${id}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      setSuccess(true);
      setPreviewImages([]);
      reset();

      Swal.fire({
        title: "Upload Successful!",
        text: "The images have been uploaded successfully, you will be redirected to the images list.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate('/dashboard/listuniversity');
      });
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error Occurred!",
        text: error.response ? error.response.data.message : "Failed to upload images, please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="uploadForm-wrapper">
      <h2 className="uploadForm-title">Add Images to University</h2>

      <div
        className="uploadForm-box"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          {...register("images")}
          onChange={handleImageChange}
          className="uploadForm-input"
        />

        {previewImages.length === 0 ? (
          <>
            <div className="uploadForm-icon">🖼️</div>
            <div className="uploadForm-text">Drag and drop images here</div>
          </>
        ) : (
          <div className="uploadForm-previewContainer">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Image ${index + 1}`}
                className="uploadForm-preview"
              />
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="uploadForm-button" disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {success && <p className="uploadForm-success">✅ Images uploaded successfully!</p>}
    </form>
  );
}
