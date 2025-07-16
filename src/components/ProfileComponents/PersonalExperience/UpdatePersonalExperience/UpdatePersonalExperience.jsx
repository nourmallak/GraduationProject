import React, { useState } from "react";
import { useContext } from "react";
import style from '../UpdatePersonalExperience/updatePersonalExperience.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "../../../../context/Context";

export default function UpdatePersonalExperience({ onSuccess }) {
    const { userProfile, showUpdatePersonalExperienceModal, setShowUpdatePersonalExperienceModal } = useContext(UserContext);
    const id = userProfile.personalExperienceId;
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            content: userProfile.personalExperienceContent
        },
        onSubmit: updatePersonalExperience
    })

    async function updatePersonalExperience() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const { data } = await axios.put(
                `${import.meta.env.VITE_API}/PersonalExperiences/Update-your-Personal-Experience/${id}`,
                { content: formik.values.content },
                {
                    headers: {
                        'personalExperienceId': `${id}`,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setShowUpdatePersonalExperienceModal(false);
            toast.success('Updated Successfully', {
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
        } finally {
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
                            rows={8}
                            className="form-control"
                            id="content"
                            name='content'
                            value={formik.values.content}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                    </div>

                    <button type="submit" className={`${style.savebtn}`}>Save Changes</button>
                </form>
            }
        </>
    );
}