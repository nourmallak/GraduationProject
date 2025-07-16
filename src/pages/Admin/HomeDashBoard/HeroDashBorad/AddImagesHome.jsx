import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import "./AddImagesHome.css"; // external CSS file
import { useNavigate } from "react-router-dom";

export default function AddImagesHome() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  // Submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append each selected image
    if (data.Images && data.Images.length > 0) {
      for (let i = 0; i < data.Images.length; i++) {
        formData.append("Images", data.Images[i]);
      }
    } else {
      Swal.fire("Error", "Please select at least one image", "error");
      return;
    }

    try {
      const response = await axios.post(
        "http://pcpc.runasp.net/MainPageImage/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("user token")}`,
          },
        }
      );
      navigate('/dashboard/')
      Swal.fire("Success", "Images uploaded successfully!", "success");
      reset();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload images", "error");
    }
  };

  return (
    <div className="add-images-wrapper">
      <h2 className="form-title-add-images">Add Images to Home Page</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="add-images-form-add-images">
        <label className="file-label-add-images">Choose Images</label>
        <input
          type="file"
          {...register("Images")}
          accept="image/*"
          multiple
          required
          className="file-input-add-images"
        />
        <button type="submit" className="submit-button-add-images">Upload</button>
      </form>
    </div>
  );
}
