import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../UpdateDescription/UpdateDescription.module.css';


export default function UpdateDescription({ show, onHide, competitionId, description, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        description: Yup.string()
            .trim()
            .required('Description is required')
    });

    const formik = useFormik({
        initialValues: {
            description: description
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: updatedescription
    });


    async function updatedescription() {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const response = await axios.put(
                `${import.meta.env.VITE_API}/Compitions/UpdateDescription/${competitionId}`,
                formik.values.description,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success(response.data?.Message || "Description updated successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data || "Failed to update description", {
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
                </div>
                :
                <>
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}> Description</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
                        <div className="mb-3">
                            <textarea
                                name="description"
                                rows="5"
                                className={`form-control ${styles.textarea}`}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="text-danger mt-1">
                                    {formik.errors.description}
                                </div>
                            ) : null}
                        </div>

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
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className={styles.spinner}
                                        />
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                </>}

        </Modal>
    );
}