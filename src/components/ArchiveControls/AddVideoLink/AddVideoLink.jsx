import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import { FiYoutube } from 'react-icons/fi';
import styles from './AddVideoLink.module.css';

export function AddVideoLink({ show, onHide, competition, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            videoLink: ''
        },
        validationSchema: Yup.object({
            videoLink: Yup.string()
                .required("Video URL is required")
        }),
        onSubmit: handleAddVideoLink
    });

    async function handleAddVideoLink(values, { setSubmitting, resetForm }) {
    setIsLoading(true);
    console.log("Competition:", competition);
    console.log("Submitting video link:", values.videoLink);

    try {
        const token = localStorage.getItem("user token");
        console.log("Token:", token);

        await axios.post(
            `${import.meta.env.VITE_API}/Compitions/Add-VideoLink?competitionId=${competition?.idForCompetition}`,
            formik.values.videoLink,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        toast.success("Video link added successfully", {
            position: "bottom-right",
            autoClose: 5000,
            transition: Bounce,
            className: styles.toastSuccess
        });

        resetForm();
        onSuccess();
        onHide();
    } catch (error) {
        console.error("Error response:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to add video link", {
            position: "bottom-right",
            autoClose: 5000,
            transition: Bounce,
            className: styles.toastError
        });
    } finally {
        setSubmitting(false);
        setIsLoading(false);
    }
}


    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" className={styles.modal}>
            {isLoading ?
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div> :
                <>
                    {/* Modal Header */}
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}>Add Video Link</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className={`modal-body ${styles.modalBody}`}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="formVideoLink" className={`form-label ${styles.formLabel}`}>
                                    YouTube Video URL
                                </label>
                                <div className={styles.inputGroup}>
                                    <span className={styles.inputGroupText}>
                                        <FiYoutube className={styles.youtubeIcon} />
                                    </span>
                                    <input
                                        type="url"
                                        id="formVideoLink"
                                        name="videoLink"
                                        className={`form-control ${styles.formControl}`}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={formik.values.videoLink}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        disabled={formik.isSubmitting}
                                    />
                                </div>
                                {formik.touched.videoLink && formik.errors.videoLink && (
                                    <div className={`text-danger ${styles.errorText}`}>
                                        {formik.errors.videoLink}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className={`d-flex justify-content-end gap-2 ${styles.buttonContainer}`}>
                                <button
                                    type="button"
                                    className={`btn btn-outline-secondary ${styles.secondaryButton}`}
                                    onClick={onHide}
                                    disabled={formik.isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${styles.primaryButton}`}
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting ? (
                                        <>
                                            <div className={`spinner-border spinner-border-sm ${styles.spinner}`} role="status" />
                                            Adding...
                                        </>
                                    ) : (
                                        "Add Video"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </>}
        </Modal>
    );
}

export default AddVideoLink;