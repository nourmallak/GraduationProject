import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './AddScoreboard.module.css';

export function AddScoreboard({ show, onHide, competition, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            imageForScoreboard: null
        },
        validationSchema: Yup.object({
            image: Yup.mixed()
                .required("Please select an image")
        }),
        onSubmit: handleUploadImage
    });

    async function handleUploadImage(values, { setSubmitting, resetForm }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const formData = new FormData();
            formData.append('imageForScoreboard', values.image);

            await axios.post(
                `${import.meta.env.VITE_API}/Compitions/Add-Image-For-Scoreboard?competitionId=${competition?.idForCompetition}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success("Scoreboard image added successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });

            resetForm();
            onSuccess();
            onHide();
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || "Failed to add scoreboard image", {
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
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}>Add Scoreboard Image</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className={`modal-body ${styles.modalBody}`}>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="formImage" className={`form-label ${styles.formLabel}`}>
                                    Scoreboard Image
                                </label>
                                <input
                                    type="file"
                                    id="formImage"
                                    name="image"
                                    accept="image/*"
                                    className={`form-control ${styles.formControl} ${styles.fileInput}`}
                                    onChange={(event) => {
                                        formik.setFieldValue("image", event.currentTarget.files[0]);
                                    }}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.image && formik.errors.image && (
                                    <div className={`text-danger ${styles.errorText}`}>
                                        {formik.errors.image}
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
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload Image"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </>}
        </Modal>
    );
}

export default AddScoreboard;