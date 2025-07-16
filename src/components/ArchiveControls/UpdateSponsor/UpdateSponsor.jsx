import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../UpdateSponsor/UpdateSponsor.module.css';

export default function UpdateSponsor({ show, onHide, sponsor, onSuccess }) {
    const [logoPreview, setLogoPreview] = useState(sponsor?.logo || '');
    const [isLoading, setIsLoading] = useState(false);

    console.log(sponsor);
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
        description: Yup.string().required("Description is required"),
        website: Yup.string().url("Enter a valid URL").required("Website is required"),
        instlink: Yup.string().url("Enter a valid Instagram URL"),
        facelink: Yup.string().url("Enter a valid Facebook URL"),
        gmail: Yup.string().email("Enter a valid email"),
        logo: Yup.mixed()
    });

    const formik = useFormik({
        initialValues: {
            name: sponsor?.name || '',
            description: sponsor?.description || '',
            website: sponsor?.website || '',
            instlink: sponsor?.instlink || '',
            facelink: sponsor?.facelink || '',
            gmail: sponsor?.gmail || '',
            logo: sponsor?.logo || null
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: updateSponsor
    });

    async function updateSponsor(values, { setSubmitting }) {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("user token");

            const formData = new FormData();
            formData.append("Name", values.name);
            formData.append("Description", values.description);
            formData.append("Website", values.website);
            formData.append("InstLink", values.instlink);
            formData.append("FaceLink", values.facelink);
            formData.append("Gmail", values.gmail);
            if (values.logo) {
                formData.append("Logo", values.logo);
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API}/Sponsor/update/${sponsor.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(response.data?.Message || "Sponsor updated successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onSuccess();
            onHide();
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data || "Failed to update sponsor", {
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
                        <h5 className={`modal-title ${styles.modalTitle}`}>Update Sponsor</h5>
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
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Sponsor name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-danger mt-1">{formik.errors.name}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <textarea
                                name="description"
                                rows="4"
                                className="form-control"
                                placeholder="Sponsor description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-danger mt-1">{formik.errors.description}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <input
                                type="url"
                                name="website"
                                className="form-control"
                                placeholder="Website URL"
                                value={formik.values.website}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                            {formik.touched.website && formik.errors.website && (
                                <div className="text-danger mt-1">{formik.errors.website}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <input
                                type="url"
                                name="instlink"
                                className="form-control"
                                placeholder="Instagram link"
                                value={formik.values.instlink}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="url"
                                name="facelink"
                                className="form-control"
                                placeholder="Facebook link"
                                value={formik.values.facelink}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="email"
                                name="gmail"
                                className="form-control"
                                placeholder="Gmail"
                                value={formik.values.gmail}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                disabled={formik.isSubmitting}
                            />
                        </div>

                        <div className="mb-3">
                            <input
                                type="file"
                                name="logo"
                                accept="image/*"
                                className="form-control"
                                onChange={(event) => {
                                    formik.setFieldValue("logo", event.currentTarget.files[0]);
                                    setLogoPreview(URL.createObjectURL(event.currentTarget.files[0]));
                                }}
                                disabled={formik.isSubmitting}
                            />
                            {logoPreview && (
                                <img src={logoPreview} alt="Preview" className="mt-2 rounded" style={{ maxHeight: "100px" }} />
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update"
                                )}
                            </button>
                        </div>
                    </form>
                </>}

        </Modal>
    );
}
