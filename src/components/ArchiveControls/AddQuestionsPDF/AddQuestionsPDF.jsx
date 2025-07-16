import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddQuestionsPDF/AddQuestionsPDF.module.css';

export default function AddQuestionsPDF({ show, onHide, competitionId, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        imageForQuestionsPdf: Yup.mixed()
            .required('Image is required')
            .test('fileType', 'Only image files are allowed', value =>
                value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
            ),
        questionsPdf: Yup.mixed()
            .required('PDF file is required')
            .test('fileType', 'Only PDF files are allowed', value =>
                value && value.type === 'application/pdf'
            )
    });

    const formik = useFormik({
        initialValues: {
            imageForQuestionsPdf: null,
            questionsPdf: null
        },
        validationSchema,
        onSubmit: uploadQuestionsPdf
    });

    async function uploadQuestionsPdf(values, { setSubmitting }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const formData = new FormData();
            formData.append("imageForQuestionsPdf", values.imageForQuestionsPdf);
            formData.append("questionsPdf", values.questionsPdf);

            const response = await axios.post(
                `${import.meta.env.VITE_API}/QuestionsPdf/competitions/${competitionId}/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(response.data?.Message || "Questions PDF uploaded successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            toast.error(error.response?.data || "Failed to upload questions PDF", {
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
                    <p>Uploading...</p>
                </div>
            ) : (
                <>
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}>Upload Questions PDF</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
                        <div className="mb-3">
                            <label className="form-label">Cover Image</label>
                            <input
                                type="file"
                                name="imageForQuestionsPdf"
                                className="form-control"
                                accept="image/*"
                                onChange={(event) =>
                                    formik.setFieldValue("imageForQuestionsPdf", event.currentTarget.files[0])
                                }
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.imageForQuestionsPdf && formik.errors.imageForQuestionsPdf && (
                                <div className="text-danger mt-1">{formik.errors.imageForQuestionsPdf}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Questions PDF</label>
                            <input
                                type="file"
                                name="questionsPdf"
                                className="form-control"
                                accept="application/pdf"
                                onChange={(event) =>
                                    formik.setFieldValue("questionsPdf", event.currentTarget.files[0])
                                }
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.questionsPdf && formik.errors.questionsPdf && (
                                <div className="text-danger mt-1">{formik.errors.questionsPdf}</div>
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
                                        Uploading...
                                    </>
                                ) : (
                                    "Upload"
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </Modal>
    );
}
