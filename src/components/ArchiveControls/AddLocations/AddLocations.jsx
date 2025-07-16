import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddLocations/AddLocations.module.css';

export default function AddLocations ({ show, onHide, competitionId, onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        names: Yup.string()
            .trim()
            .required('Location names are required (separate by comma)')
    });

    const formik = useFormik({
        initialValues: {
            names: ''
        },
        validationSchema,
        onSubmit: addLocations
    });

    async function addLocations(values, { setSubmitting }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");
            const locationNames = values.names.split(',').map(name => name.trim()).filter(Boolean);

            const dto = {
                names: locationNames
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API}/Location/competitions/${competitionId}/locations`,
                dto,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            toast.success(response.data?.Message || "Locations added successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            toast.error(error.response?.data || "Failed to add locations", {
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
                        <h5 className={`modal-title ${styles.modalTitle}`}>Add Locations</h5>
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
                                name="names"
                                rows="5"
                                className={`form-control ${styles.textarea}`}
                                value={formik.values.names}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                                placeholder="Enter locations separated by commas (e.g., Gaza, Ramallah, Nablus)"
                            />
                            {formik.touched.names && formik.errors.names ? (
                                <div className="text-danger mt-1">
                                    {formik.errors.names}
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
                                        Adding...
                                    </>
                                ) : (
                                    "Add"
                                )}
                            </button>
                        </div>
                    </form>
                </>}

        </Modal>
    );
}
