import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './AddParticipant.module.css';

export default function AddParticipant({ show, onHide, team, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    participantName: Yup.string().required("Name is required"),
    participantEmail: Yup.string().email().required("Email is required")
  });

  const formik = useFormik({
    initialValues: {
      participantEmail: '',
      participantName: ''
    },
    validationSchema,
    onSubmit: addParticipant
  });

  async function addParticipant(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");

      const response = await axios.post(
        `${import.meta.env.VITE_API}/Participants/Add-newParticipant-To-Team/${team.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.Message || "Participant added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Add error:", error);
      toast.error(error.response?.data || "Failed to add participant", {
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
            <h5 className={`modal-title ${styles.modalTitle}`}>Add Participant</h5>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                name="participantName"
                className="form-control"
                value={formik.values.participantName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.participantName && formik.errors.participantName && (
                <div className="text-danger mt-1">{formik.errors.participantName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="participantEmail"
                className="form-control"
                value={formik.values.participantEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={formik.isSubmitting}
              />
              {formik.touched.participantEmail && formik.errors.participantEmail && (
                <div className="text-danger mt-1">{formik.errors.participantEmail}</div>
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
