import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './addImages.module.css';

export function AddImages({ show, onHide, competitionId, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            images: null
        },
        validationSchema: Yup.object({
            images: Yup.mixed()
                .required("Please select at least one image")
                .test("fileCount", "Please select at least one image", (value) => {
                    return value && value.length > 0;
                })
        }),
        onSubmit: handleUploadImages
    });

    async function handleUploadImages(values, { setSubmitting, resetForm }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const formData = new FormData();

            for (let i = 0; i < values.images.length; i++) {
                formData.append('Images', values.images[i]);
            }

            const response = await axios.post(
                `${import.meta.env.VITE_API}/CompetitionImages/competitions/${competitionId}/images`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success("Images uploaded successfully", {
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
            toast.error(error.response?.data?.message || "Failed to upload images", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastError
            });
        } finally {
            setSubmitting(false);
            setIsLoading(false)
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
                        <h5 className={`modal-title ${styles.modalTitle}`}>Add Competition Images</h5>
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
                            {/* Images Input */}
                            <div className="mb-4">
                                <label htmlFor="formImages" className={`form-label ${styles.formLabel}`}>
                                    Select Images
                                </label>
                                <input
                                    type="file"
                                    id="formImages"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    className={`form-control ${styles.formControl} ${styles.fileInput}`}
                                    onChange={(event) => {
                                        formik.setFieldValue("images", event.currentTarget.files);
                                    }}
                                    onBlur={formik.handleBlur}
                                    disabled={formik.isSubmitting}
                                />
                                {formik.touched.images && formik.errors.images && (
                                    <div className={`text-danger ${styles.errorText}`}>
                                        {formik.errors.images}
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
                                        "Upload Images"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </>}

        </Modal>

    );
}

export default AddImages;