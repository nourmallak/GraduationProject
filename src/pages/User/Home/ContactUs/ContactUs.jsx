import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import contact_img from "../../../../images/image/contt.png";
import "./ContactUs.css";

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const token = localStorage.getItem("user token");
  const isLoggedIn = !!token;

  const onSubmit = async (data) => {
  if (!isLoggedIn) return; // مجرد احتياط إضافي

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API}/Auths/Contact-Us`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Swal.fire({
      icon: "success",
      title: "Sent!",
      text: "Your message has been sent successfully.",
    });
    reset();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to send your message.",
    });
  }
};


  return (
    <div className="contact-container">
      <div className="cont">
        <div className="form-wrapper">
          <h2 className="form-title">Contact us</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="form-main">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              placeholder="Your Name"
              className="form-input"
            />
            {errors.name && <p className="error-msg">{errors.name.message}</p>}

            <label htmlFor="message" className="form-label">
              Message
            </label>
            <textarea
              id="message"
              {...register("message", { required: "Message is required" })}
              rows="6"
              placeholder="Your Message"
              className="form-textarea"
            />
            {errors.message && (
              <p className="error-msg">{errors.message.message}</p>
            )}

            <button
  type="submit"
  className="btnnContactt"
  onClick={(e) => {
    if (!isLoggedIn) {
      e.preventDefault(); // امنع الإرسال
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "You must be logged in to contact us.",
      });
    }
  }}
>
  {isSubmitting ? "Sending..." : "Send"}
</button>

          </form>
        </div>

        <div className="image-container">
          <img src={contact_img} alt="Contact Us" className="contact-image" />
        </div>
      </div>
    </div>
  );
}
