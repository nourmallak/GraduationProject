import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './UpdateQuestionsPdf.module.css'; 

export default function AddOrUpdateQuestionsPdf({ show, onHide, competition, onSuccess }) {
    const [previewImage, setPreviewImage] = useState(competition?.imageForQuestionsPDF || '');
    const [isLoading, setIsLoading] = useState(false);
    console.log(competition);
    const validationSchema = Yup.object().shape({
        questionsPdf: Yup.mixed().required("PDF file is required"),
        imageForQuestionsPdf: Yup.mixed()
    });

    const formik = useFormik({
        initialValues: {
            questionsPdf: competition?.qusetionPDF,
            imageForQuestionsPdf: competition?.imageForQuestionsPDF
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: updateQuestionsPdf
    });

    async function updateQuestionsPdf(values, { setSubmitting }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");

            const formData = new FormData();
            formData.append("QuestionsPdf", formik.values.questionsPdf);
            if (values.imageForQuestionsPdf) {
                formData.append("ImageForQuestionsPdf", formik.values.imageForQuestionsPdf);
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API}/Compitions/update-questionspdf-and-image/${competition.idForCompetition}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(response.data?.Message || "Questions updated successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data || "Failed to update questions", {
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
                        <h5 className={`modal-title ${styles.modalTitle}`}>Questions PDF</h5>
                        <button type="button" className={`btn-close ${styles.closeButton}`} onClick={onHide}></button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
                        <div className="mb-3">
                            <label className="form-label">Upload PDF File</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                name="questionsPdf"
                                className="form-control"
                                onChange={(event) => formik.setFieldValue("questionsPdf", event.currentTarget.files[0])}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.questionsPdf && formik.errors.questionsPdf && (
                                <div className="text-danger mt-1">{formik.errors.questionsPdf}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                name="imageForQuestionsPdf"
                                className="form-control"
                                onChange={(event) => {
                                    formik.setFieldValue("imageForQuestionsPdf", event.currentTarget.files[0]);
                                    setPreviewImage(URL.createObjectURL(event.currentTarget.files[0]));
                                }}
                                disabled={formik.isSubmitting}
                            />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="mt-2 rounded" style={{ maxHeight: "100px" }} />
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
                                    "Update"
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </Modal>
    );
}
