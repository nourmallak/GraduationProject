import React, { useState } from "react";
import { useContext } from "react";
import style from '../DeletePersonalExperience/deletePersonalExperience.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "../../../../context/Context";

export default function DeletePersonalExperience({ onSuccess }) {
    const { userProfile, setShowDeletePersonalExperienceModal } = useContext(UserContext);
    const experienceId = userProfile.personalExperienceId;
    const [isLoading, setIsLoading] = useState(false);

    async function deletePersonalExperience() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const { data } = await axios.delete(`${import.meta.env.VITE_API}/PersonalExperiences/Delete-Experience/${experienceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            setShowDeletePersonalExperienceModal(false);
            toast.success('Deleted Successfully', {
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


    const cancleDelete = () => {
        setShowDeletePersonalExperienceModal(false);
    }

    return (
        <>
            {isLoading ? <div className={style.loadingState}>
                <div className={style.spinner}></div>
                <p>Loading...</p>
            </div>
                :
                <div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete your personal experience?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className={`${style.cancleBtn}`} data-dismiss="modal" onClick={cancleDelete}>Cancle</button>
                        <button type="button" className={`${style.saveBtn}`} onClick={deletePersonalExperience}>Yes, delete it!</button>
                    </div>
                </div>
            }
        </>
    );
}