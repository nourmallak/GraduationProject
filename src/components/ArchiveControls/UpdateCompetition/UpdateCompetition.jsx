import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../UpdateCompetition/UpdateCompetition.module.css';

export default function UpdateCompetition({ show, onHide, currentCompetition, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: currentCompetition?.name,
      time: currentCompetition?.time,
      image: currentCompetition?.image
    },
    enableReinitialize: true,
    onSubmit: updateCompetition
  });

  async function updateCompetition(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");

      const formData = new FormData();
      formData.append("Name", values.name);
      formData.append("Time", values.time);
      if (values.image) formData.append("Image", values.image);

      const response = await axios.put(
        `${import.meta.env.VITE_API}/Compitions/UpdateCompetition/${currentCompetition.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(response.data?.Message || "Competition updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data || "Failed to update competition", {
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
            <h5 className={`modal-title ${styles.modalTitle}`}>Update Competition</h5>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>
          {isLoading ?
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Loading post...</p>
            </div>
            :
            <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
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
                <label className="form-label">Time</label>
                <input
                  name="time"
                  type="datetime-local"
                  className="form-control"
                  value={formik.values.time}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.time && formik.errors.time && (
                  <div className="text-danger mt-1">{formik.errors.time}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Image (optional)</label>
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(event) => formik.setFieldValue("image", event.currentTarget.files[0])}
                  disabled={formik.isSubmitting}
                />
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
            </form>}
        </>}


    </Modal>
  );
}
