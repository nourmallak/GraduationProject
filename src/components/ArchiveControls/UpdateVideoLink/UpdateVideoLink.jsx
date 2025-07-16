import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './UpdateVideoLink.module.css';

export function UpdateVideoLink({ show, onHide, competition, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            videoLink: competition?.videoLink
        },
        validationSchema: Yup.object({
            videoLink: Yup.string()
                .required("Video URL is required")
        }),
        enableReinitialize: true,
        onSubmit: handleUpdateVideoLink
    });

    async function handleUpdateVideoLink(values, { setSubmitting, resetForm }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");

            await axios.put(
                `${import.meta.env.VITE_API}/Compitions/Update-videoLink/${competition?.idForCompetition}`,
                formik.values.videoLink,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success("Video link updated successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });

            resetForm();
            onSuccess();
            onHide();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || "Failed to update video link", {
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
                        <h5 className={`modal-title ${styles.modalTitle}`}>
                            {competition.videoLink ? 'Update' : 'Add'} Video Link
                        </h5>
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
                                            Updating...
                                        </>
                                    ) : (
                                        competition.videoLink ? "Update" : "Add"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </>}
        </Modal>
    );
}

export default UpdateVideoLink;