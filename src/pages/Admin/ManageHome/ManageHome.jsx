import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./ManageHome.css";

// Schema validation
const formSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  cover: z
    .any()
    .refine((file) => file && file.length > 0 && file[0] instanceof File, {
      message: "Please upload a cover image",
    }),
  video: z
    .any()
    .refine((file) => file && file.length > 0 && file[0] instanceof File, {
      message: "Please upload a video file",
    }),
  images: z
    .any()
    .refine(
      (files) =>
        files &&
        files.length > 0 &&
        [...files].every((f) => f instanceof File),
      {
        message: "Please upload at least one image",
      }
    ),
  facebook: z.string().url({ message: "Invalid Facebook link" }),
  instagram: z.string().url({ message: "Invalid Instagram link" }),
  linkedin: z.string().url({ message: "Invalid LinkedIn link" }),
});

export default function CustomForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Used to set the value of the form field manually
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();
  const [previewImages, setPreviewImages] = useState([]);
  const [previewCover, setPreviewCover] = useState(null);

  // Handle image selection
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle cover image selection
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewCover(URL.createObjectURL(file));
    }
  };

  // On form submit
  const onSubmit = async (data) => {
    try {
      const token = `Bearer ${localStorage.getItem("user token")}`;

      const mainFormData = new FormData();

      // Always send the updated date value, using new Date()
      mainFormData.append("Date", new Date(data.date).toISOString());

      if (data.cover) {
        mainFormData.append("Cover", data.cover[0]);
      }
      if (data.video) {
        mainFormData.append("Video", data.video[0]);
      }

      mainFormData.append("FacebookLink", data.facebook);
      mainFormData.append("InstagramLink", data.instagram);
      mainFormData.append("LinkedInLink", data.linkedin);

      await axios.post(`${import.meta.env.VITE_API}/MainPage/add`, mainFormData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      const imagesFormData = new FormData();
      for (let i = 0; i < data.images.length; i++) {
        imagesFormData.append("images", data.images[i]);
      }

      await axios.post(
       `${import.meta.env.VITE_API}/MainPageImage/add`,
        imagesFormData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // After successful submission, update the date value again (so it stays up-to-date)
      setValue("date", new Date().toISOString());

      Swal.fire({
        title: "Submitted successfully",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.error("Error during submission:", error);
      Swal.fire({
        title: "Submission failed",
        text: error?.response?.data?.message || "Please try again later",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="containerManageHome">
      <div className="text-center-home">Enter your information</div>
      <div className="row-home">
        {/* Left section */}
        <div className="col-left-home">
          {/* Date */}
          <div className="mb-3">
            <label className="form-label-home">Date:</label>
            <input
              type="datetime-local"
              {...register("date")}
              className="form-control-home"
            />
            {errors.date && <p className="error">{errors.date.message}</p>}
          </div>

          {/* Cover Image */}
          <div className="mb-3">
            <label className="form-label-home">Cover Image:</label>
            <input
              type="file"
              accept="image/*"
              {...register("cover")}
              onChange={handleCoverChange}
              className="form-control-home"
            />
            {previewCover && (
              <img
                src={previewCover}
                alt="Cover Preview"
                className="home-img-upload"
              />
            )}
            {errors.cover && <p className="error">{errors.cover.message}</p>}
          </div>

          {/* Video */}
          <div className="mb-3">
            <label className="form-label-home">Video:</label>
            <input
              type="file"
              accept="video/*"
              {...register("video")}
              className="form-control-home"
            />
            {errors.video && <p className="error">{errors.video.message}</p>}
          </div>

          {/* Images */}
          <div className="mb-3">
            <label className="form-label-home">Image Gallery:</label>
            <div className="upload-box-home">
              <input
                type="file"
                multiple
                accept="image/*"
                {...register("images")}
                onChange={handleImagesChange}
                className="form-control-file-home"
              />
              {previewImages.length === 0 && (
                <>
                  <div className="upload-icon-home">📷</div>
                  <div className="upload-text-home">
                    Click or drag images here
                  </div>
                </>
              )}
              {previewImages.length > 0 && (
                <div className="image-previews">
                  {previewImages.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Image ${idx + 1}`}
                      className="home-img-upload"
                    />
                  ))}
                </div>
              )}
            </div>
            {errors.images && <p className="error">{errors.images.message}</p>}
          </div>
        </div>

        {/* Right section */}
        <div className="col-right-home">
          {/* Facebook */}
          <div className="mb-3">
            <label className="form-label-home">Facebook Link:</label>
            <input
              type="url"
              {...register("facebook")}
              className="form-control-home"
            />
            {errors.facebook && (
              <p className="error">{errors.facebook.message}</p>
            )}
          </div>

          {/* Instagram */}
          <div className="mb-3">
            <label className="form-label-home">Instagram Link:</label>
            <input
              type="url"
              {...register("instagram")}
              className="form-control-home"
            />
            {errors.instagram && (
              <p className="error">{errors.instagram.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div className="mb-3">
            <label className="form-label-home">LinkedIn Link:</label>
            <input
              type="url"
              {...register("linkedin")}
              className="form-control-home"
            />
            {errors.linkedin && (
              <p className="error">{errors.linkedin.message}</p>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="btnAddDashBoard-home">
        Submit
      </button>
    </form>
  );
}
