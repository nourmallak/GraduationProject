import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../UpdateInvitation/UpdateInvitation.module.css'; 

export default function UpdateInvitation({ show, onHide, competition, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        image2: Yup.mixed().required("Image is required")
    });

    const formik = useFormik({
        initialValues: {
            image2: competition?.image2
        },
        validationSchema,
        onSubmit: updateInvitation
    });

    async function updateInvitation(values, { setSubmitting }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const formData = new FormData();
            formData.append("image2", values.image2);

            const response = await axios.put(
                `${import.meta.env.VITE_API}/Compitions/update-invitation-image2/${competition.idForCompetition}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(response.data?.Message || "Saved successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data || "Failed to save invitation image", {
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
            {isLoading ? (
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}> Invitation Image</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
                        <div className="mb-3">
                            <input
                                type="file"
                                name="image2"
                                accept="image/*"
                                className="form-control"
                                onChange={(event) => {
                                    const file = event.currentTarget.files[0];
                                    formik.setFieldValue("image2", file);
                                }}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.image2 && formik.errors.image2 && (
                                <div className="text-danger mt-1">{formik.errors.image2}</div>
                            )}
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
                </>
            )}
        </Modal>
    );
}
