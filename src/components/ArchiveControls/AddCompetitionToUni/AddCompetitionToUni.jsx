import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddCompetitionToUni/AddCompetitionToUni.module.css';

export default function AddCompetitionToUni({ show, onHide, universityId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    Name: Yup.string().required("Name is required"),
    Time: Yup.string().required("Time is required")
  });

  const formik = useFormik({
    initialValues: {
      Name: '',
      Time: '',
      Description: '',
      Image: null,
      Image2: null,
      QuestionsPDF: null
    },
    validationSchema,
    onSubmit: addCompetition
  });

  async function addCompetition(values, { setSubmitting, resetForm }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");
      const formData = new FormData();

      formData.append("Name", values.Name);
      formData.append("Time", values.Time);
      formData.append("Description", values.Description || '');

      if (values.Image) formData.append("Image", values.Image);
      if (values.Image2) formData.append("Image2", values.Image2);
      if (values.QuestionsPDF) formData.append("QuestionsPDF", values.QuestionsPDF);

      const response = await axios.post(
        `${import.meta.env.VITE_API}/Compitions/Add-CompetitionToUniversity?universityId=${universityId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(response.data?.Message || "Competition added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });

      resetForm();
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Add competition error:", error);
      toast.error(error.response?.data?.Message || "Failed to add competition", {
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
      {isLoading ? <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
        :
        <>
          <div className={`modal-header ${styles.modalHeader}`}>
            <h5 className={`modal-title ${styles.modalTitle}`}>Add Competition</h5>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
            <div className="mb-3">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="Name"
                className="form-control"
                value={formik.values.Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.Name && formik.errors.Name && (
                <div className="text-danger">{formik.errors.Name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Time *</label>
              <input
                type="datetime-local"
                name="Time"
                className="form-control"
                value={formik.values.Time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.Time && formik.errors.Time && (
                <div className="text-danger">{formik.errors.Time}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="Description"
                className="form-control"
                rows={3}
                value={formik.values.Description}
                onChange={formik.handleChange}
                disabled={formik.isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Cover Image</label>
              <input
                type="file"
                name="Image"
                accept="image/*"
                className="form-control"
                onChange={(event) =>
                  formik.setFieldValue("Image", event.currentTarget.files[0])
                }
                disabled={formik.isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Invitation Image</label>
              <input
                type="file"
                name="Image2"
                accept="image/*"
                className="form-control"
                onChange={(event) =>
                  formik.setFieldValue("Image2", event.currentTarget.files[0])
                }
                disabled={formik.isSubmitting}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Competitions Questions PDF</label>
              <input
                type="file"
                name="QuestionsPDF"
                accept="application/pdf"
                className="form-control"
                onChange={(event) =>
                  formik.setFieldValue("QuestionsPDF", event.currentTarget.files[0])
                }
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