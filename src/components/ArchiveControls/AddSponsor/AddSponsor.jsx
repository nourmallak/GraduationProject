import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddSponsor/AddSponsor.module.css';
import { requestFormReset } from 'react-dom';

export default function AddSponsor({ show, onHide, competitionId, onSuccess }) {
  const [logoFile, setLogoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    website: Yup.string().url('Invalid URL').required('Website is required'),
    logo: Yup.mixed().required('Logo is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      website: '',
      logo: null
    },
    validationSchema,
    onSubmit: addSponsor
  });

  async function addSponsor(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");
      const formData = new FormData();

      formData.append("Name", values.name);
      formData.append("Description", values.description);
      formData.append("Website", values.website);
      formData.append("Logo", logoFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API}/Sponsor/AddSponsorToCompetition/${competitionId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(response.data?.Message || "Sponsor added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });
      onSuccess();
      onHide();
      formik.resetForm();
    } catch (error) {
      console.error("Add sponsor error:", error);
      toast.error(error.response?.data || "Failed to add sponsor", {
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
            <h5 className={`modal-title ${styles.modalTitle}`}>Add Sponsor</h5>
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
                placeholder="Name"
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
                rows="3"
                className="form-control"
                placeholder="Description"
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
                type="text"
                name="website"
                className="form-control"
                placeholder="Website"
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
              {formik.touched.instlink && formik.errors.instlink && (
                <div className="text-danger mt-1">{formik.errors.instlink}</div>
              )}
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
              {formik.touched.facelink && formik.errors.facelink && (
                <div className="text-danger mt-1">{formik.errors.facelink}</div>
              )}
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
              {formik.touched.gmail && formik.errors.gmail && (
                <div className="text-danger mt-1">{formik.errors.gmail}</div>
              )}
            </div>

            <div className="mb-3">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                name="logo"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setLogoFile(file);
                  formik.setFieldValue("logo", file);
                }}
                disabled={formik.isSubmitting}
              />
              {formik.touched.logo && formik.errors.logo && (
                <div className="text-danger mt-1">{formik.errors.logo}</div>
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
                    Adding...
                  </>
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </form>
        </>
      }

    </Modal>
  );
}
