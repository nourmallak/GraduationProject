import React, { useState } from "react";
import { useContext } from "react";
import style from '../UpdateDescription/UpdateDescription.module.css'
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { UserContext } from "../../../context/Context";

export default function UpdateDescription(id) {
    const { userProfile,showUpdateDescriptionModal ,setShowUpdateDescriptionModal} = useContext(UserContext);
        const [loading, setLoading] = useState(false);
    
    const formik = useFormik({
        initialValues: {
            description: userProfile.description
        },enableReinitialize: true,
        onSubmit: updateDescription
    })

    async function updateDescription() {
        setLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const { data } = await axios.put(
                `${import.meta.env.VITE_API}/UsersProfile/update-description/${id}`, 
                { content: formik.values.content },
                {
                    headers: { 
                        'personalExperienceId':`${id}`,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
    
            setShowUpdateDescriptionModal(false);
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
        }finally{
            setLoading(false);
        }
    }

    return (
        <>
          {loading ? <div className={style.loadingState}>
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
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                    </div>
                    
                <button type="submit" className={`${style.savebtn}`}>Save Changes</button>
            </form>
}
        </>
    );
}