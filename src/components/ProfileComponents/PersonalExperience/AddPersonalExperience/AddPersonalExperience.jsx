import React, { useContext, useState } from "react";
import style from '../AddPersonalExperience/addPersonalExperience.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../context/Context";

export function AddPersonalExperience({ onSuccess }) {
    const { userProfile, setUserProfile, showEditProfile, setShowEditProfile, showCreatePersonalExperienceModal, setShowCreatePersonalExperienceModal } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            content: ''
        },
        onSubmit: createPersonalExperience
    })

    async function createPersonalExperience() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const { data } = await axios.post(
                `${import.meta.env.VITE_API}/PersonalExperiences/Create-your-Personal-Experience`,
                { content: formik.values.content },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setShowCreatePersonalExperienceModal(false);
            toast.success('Waiting for Approved by Admin', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            onSuccess();

        } catch (error) {
            toast.error(error.response?.data || "An error occurred", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
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
            {isLoading ? <div className={style.loadingState}>
                    <div className={style.spinner}></div>
                    <p>Loading...</p>
                  </div>
                    :
            <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                <div className={`${style.input}`} >
                    <textarea
                        type="text"
                        className="form-control"
                        id="content"
                        name='content'
                        value={formik.values.content}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                </div>

                <button type="submit" className={`${style.savebtn}`}>Save</button>
            </form>
}
        </>
    );
}