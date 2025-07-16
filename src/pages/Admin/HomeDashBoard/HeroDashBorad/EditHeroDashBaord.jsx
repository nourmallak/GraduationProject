import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import './EditHeroDashBaord.css';
import { HomePageContext } from "../../../../context/HomePageContext";


export default function EditHeroDashBaord() {
  const { register, handleSubmit, setValue } = useForm();
  const [video, setVideo] = useState(null);
  const [cover, setCover] = useState(null);
  const navigate = useNavigate(); 
 const { getUser } = useContext(HomePageContext);

  const token = localStorage.getItem("user token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://pcpc.runasp.net/MainPage/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        setValue("date", data.date.slice(0, 16));
        setValue("facebookLink", data.facebookLink);
        setValue("instagramLink", data.instagramLink);
        setValue("linkedInLink", data.linkedInLink);
      } catch (err) {
        Swal.fire("Error!", "Failed to fetch current data", "error");
      }
    };

    fetchData();
  }, [token, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("Date", data.date);
      if (cover) formData.append("Cover", cover);
      if (video) formData.append("Video", video);
      formData.append("FacebookLink", data.facebookLink);
      formData.append("InstagramLink", data.instagramLink);
      formData.append("LinkedInLink", data.linkedInLink);

      await axios.put("http://pcpc.runasp.net/MainPage/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
getUser();

Swal.fire("Updated!", "Data updated successfully", "success").then(() => {
  navigate("/dashboard");
      });

    } catch (err) {
      Swal.fire("Error!", "An error occurred while updating", "error");
      console.error(err);
    }
  };

  return (
    <div className="edit-hero-form">
      <h2>Edit Main Page Data</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Date:</label>
          <input type="datetime-local" {...register("date")} />
        </div>

        <div>
          <label>Facebook Link:</label>
          <input type="text" {...register("facebookLink")} />
        </div>

        <div>
          <label>Instagram Link:</label>
          <input type="text" {...register("instagramLink")} />
        </div>

        <div>
          <label>LinkedIn Link:</label>
          <input type="text" {...register("linkedInLink")} />
        </div>

        <div>
          <label>Cover Image:</label>
          <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        </div>

        <div>
          <label>Video:</label>
          <input type="file" onChange={(e) => setVideo(e.target.files[0])} />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
