import React, { useState } from "react";
import { useContext } from "react";
import style from './addPost.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
//import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import Loader from "../../../Loader/Loader";
import { UserContext } from "../../../context/Context";
export default function AddPost({ onSuccess }) {
      const {
        showAddPostModal,
        setShowAddPostModal,
      } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            Title: '',
            Description: '',
            Image: null
        },
        onSubmit: addPost
    })

    async function addPost() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            // const decodedToken = jwt_decode(token);
            // console.log("Decoded Token:", decodedToken);
            const formData = new FormData();
            formData.append("Title", formik.values.Title);
            formData.append("Description", formik.values.Description);
            formData.append("Image", formik.values.Image);
            console.log(formik.values.Image);
            console.log(token);
            const decoded = jwtDecode(token);
            console.log("decoded" + decoded + token);
            const { data } = await axios.post(
                ` ${import.meta.env.VITE_API}/Posts/Create-post`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );


            toast.success('The Post Added Successfully', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
            setShowAddPostModal(!showAddPostModal);
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data || "An error occurred", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        }
        finally {
            setIsLoading(false);
        }
    }


    return (
        <>
            {isLoading ?
                <div className={style.loadingState}>
                    <div className={style.spinner}></div>
                    <p>Creating post...</p>
                </div>
                :
                <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                    <div className="mb-3 mt-4">
                        <input
                            type="text"
                            className="form-control"
                            id="title"
                            placeholder="Title"
                            name='Title'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                    </div>
                    <div className="mb-3 mt-4">
                        <textarea
                            className="form-control"
                            id="description"
                            rows={3}
                            defaultValue={""}
                            placeholder="Description"
                            name='Description'
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                    </div>
                    <div className="mb-3 mt-4">
                        <input
                            type="file"
                            className="form-control"
                            id="image"
                            name='Image'
                            onChange={(event) => {
                                formik.setFieldValue("Image", event.currentTarget.files[0]);
                            }}
                            onBlur={formik.handleBlur}
                        />

                    </div>


                    <button type="submit" className={`${style.savebtn}`}>Submit</button>
                </form>
            }

        </>
    );
}