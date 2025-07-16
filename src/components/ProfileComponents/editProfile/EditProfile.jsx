import React, { useState, useContext, useEffect } from "react";
import style from '../editProfile/editProfile.module.css';
import { useFormik } from "formik";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/Context";
import ChangePassword from "../ChangePassword/ChangePassword";
import { User } from "phosphor-react";

export function EditProfile({ onSuccess }) {
    const { userProfile, setUserProfile, showEditProfile, setShowEditProfile, showPasswordModal, setShowPasswordModal } = useContext(UserContext);
    const navigate = useNavigate();
    const [deletedImage, setDeletedImage] = useState(false);
    const [deletedCv, setDeletedCv] = useState(false);
    const [currentDisplayImage, setCurrentDisplayImage] = useState(userProfile.image);
    const [loading, setLoading] = useState(false);
    const [universities, setUniversities] = useState([]);
    const role = localStorage.getItem('userRole');
    const [isUser, setIsUser] = useState(role === 'User' ? true : false);

    const toggleshowPasswordModal = () => setShowPasswordModal(!showPasswordModal);

    async function fetchUniversities() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/University/GetAllUniversitiesforRigister`);
            setUniversities(response.data);
        } catch (error) {
            console.error("Error fetching universities:", error);
        }
    }
    useEffect(() => { fetchUniversities(); }, []);

    const initialValues = {
        UserName: userProfile.userName,
        Email: userProfile.email,
        Image: userProfile?.image,
        GithubLink: userProfile?.githubLink,
        LinkedInLink: userProfile?.linkedInLink,
        Cv: userProfile?.cv,
        Description: userProfile?.description || "",
        UniversityNameById: userProfile?.universityId
    };

    const formik = useFormik({
        initialValues,
        onSubmit: updateUserProfile
    });

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue("Image", file);
            setDeletedImage(false);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCurrentDisplayImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvChange = (event) => {
        formik.setFieldValue("Cv", event.currentTarget.files[0]);
        setDeletedCv(false);
    };

    async function deleteImage() {
        try {
            setCurrentDisplayImage(userProfile.defaultImage);
            setDeletedImage(true);
            formik.setFieldValue("Image", null);
        } catch (error) {
            console.error("Failed to delete image:", error);
            toast.error("Failed to delete image", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    function deleteCv() {
        setDeletedCv(true);
        formik.setFieldValue("Cv", null);
    }

    async function updateUserProfile() {
        setLoading(true);

        try {
            const token = localStorage.getItem("user token");
            const formData = new FormData();
            formData.append("UserName", formik.values.UserName);
            formData.append("Email", formik.values.Email);
            formData.append("UniversityNameById", formik.values.UniversityNameById || "");

            if (deletedImage) {
                await axios.delete(
                    `${import.meta.env.VITE_API}/UsersProfile/delete-Image/${userProfile.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                formData.append("Image", null);
            } else {
                formData.append("Image", formik.values.Image);
            }

            if (deletedCv) {
                await axios.delete(
                    `${import.meta.env.VITE_API}/UsersProfile/delete-cv/${userProfile.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                formData.append("Cv", null);
            } else {
                formData.append("Cv", formik.values.Cv);
            }

            formData.append("GithubLink", formik.values.GithubLink || "");
            formData.append("LinkedInLink", formik.values.LinkedInLink || "");
            formData.append("Description", formik.values.Description || "");

            await axios.put(
                `${import.meta.env.VITE_API}/UsersProfile/Update-Profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                }
            );

            setShowEditProfile(false);
            setDeletedImage(false);
            setDeletedCv(false);

            toast.success('Your Profile Updated Successfully', {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });

            onSuccess();

        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred", {
                position: "bottom-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        }
        finally {
            setLoading(false);
        }
    }

    const hasChanges = () => {
        return (
            formik.values.UserName !== initialValues.UserName ||
            formik.values.UniversityNameById !== initialValues.UniversityNameById ||
            formik.values.Email !== initialValues.Email ||
            formik.values.GithubLink !== initialValues.GithubLink ||
            formik.values.LinkedInLink !== initialValues.LinkedInLink ||
            formik.values.Description !== initialValues.Description ||
            (formik.values.Image !== initialValues.Image && formik.values.Image instanceof File) ||

            (formik.values.Cv instanceof File) ||
            deletedImage ||
            deletedCv
        );
    };

    return (
        <>
            {loading ? (
                <div className={style.loadingState}>
                    <div className={style.spinner}></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="container">
                    <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
                        <div className={`${style.editImage} mb-3 text-center `}>
                            <label htmlFor="imageUpload">
                                <img
                                    src={currentDisplayImage}
                                    alt="Profile"
                                    className={`${style.profileImg} img-fluid rounded-circle`}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path
                                        fill="#f8a70f"
                                        d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
                                    />
                                </svg>
                            </label>
                            <input
                                type="file"
                                id="imageUpload"
                                name="Image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <a
                                className={`${style.deleteProfileImage}`}
                                onClick={deleteImage}
                                role="button"
                                tabIndex={0}
                            >
                                Delete Profile Image
                            </a>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="userName" className={style.boldLabel}>UserName</label>
                                <input type="text" className="form-control" id="userName" name="UserName" {...formik.getFieldProps("UserName")} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="email" className={style.boldLabel}>Email</label>
                                <input type="email" className="form-control" id="email" name="Email" disabled {...formik.getFieldProps("Email")} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label htmlFor="githubLink" className={style.boldLabel}>Github Link</label>
                                <input type="url" className="form-control" id="githubLink" name="GithubLink" {...formik.getFieldProps("GithubLink")} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="linkedInLink" className={style.boldLabel}>LinkedIn Link</label>
                                <input type="url" className="form-control" id="linkedInLink" name="LinkedInLink" {...formik.getFieldProps("LinkedInLink")} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className={isUser ? "col-md-6" : "col-md-12"}>
                                <label htmlFor="cv" className={style.boldLabel}>CV</label>
                                <input type="file" className="form-control" id="cv" name="Cv" onChange={handleCvChange} />
                                <a className={`${style.deleteCV} mt-3`} onClick={deleteCv} role="button" tabIndex={0}>Delete CV</a>
                            </div>
                            {isUser &&
                                <div className="col-md-6">
                                    <label htmlFor="universityId" className={`${style.boldLabel}`}>University</label>
                                    <select
                                        id="universityId"
                                        name="UniversityNameById" 
                                        className="form-control"
                                        value={formik.values?.UniversityNameById}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        required
                                    >
                                        <option value=''>Select your university</option>
                                        {universities.map(university => (
                                            <option key={university.universityId} value={university.universityId}>
                                                {university.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            }

                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className={style.boldLabel}>Description</label>
                            <textarea className="form-control" id="description" name="Description" rows="4" {...formik.getFieldProps("Description")} />
                        </div>

                        <button type="submit" className={style.saveChanges} disabled={!hasChanges() || loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : 'Save changes'}
                        </button>

                        <button type="button" className={`${style.changePasswordBtn} mt-3`} onClick={() => setShowPasswordModal(true)}>
                            Change Password
                        </button>

                        <ChangePassword show={showPasswordModal} onClose={toggleshowPasswordModal} />
                    </form>

                </div>
            )}
        </>
    );
}
