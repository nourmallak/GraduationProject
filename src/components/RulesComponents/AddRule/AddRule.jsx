import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Formik, FieldArray, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddRule/AddRule.module.css';

export default function AddRule({ show, onHide, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required('Title is required'),
    description: Yup.array()
      .of(Yup.string().trim().required('Description line is required'))
      .min(1, 'At least one description line is required')
  });

  const initialValues = {
    title: '',
    description: ['']
  };

  async function handleAddRule(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");
      const response = await axios.post(
        `${import.meta.env.VITE_API}/Rule/Add-Rule`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.Message || "Rule added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });

      onSuccess();
      onHide();
    } catch (error) {
      toast.error(error.response?.data || "Failed to add rule", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastError
      });
    } finally {
      setIsLoading(false);
      setSubmitting(false);
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
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleAddRule}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <>
              <div className={`modal-header ${styles.modalHeader}`}>
                <h5 className={`modal-title ${styles.modalTitle}`}>Add Rule</h5>
                <button
                  type="button"
                  className={`btn-close ${styles.closeButton}`}
                  onClick={onHide}
                  aria-label="Close"
                ></button>
              </div>

              <Form className={`modal-body ${styles.modalBody}`}>
                {/* Title */}
                <div className="mb-3">
                  <label className={styles.formLabel}>Rule Title</label>
                  <input
                    name="title"
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.title && errors.title && (
                    <div className={styles.errorText}>{errors.title}</div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className={styles.formLabel}>Descriptions</label>
                  <FieldArray name="description">
                    {({ push, remove }) => (
                      <div>
                        {values.description.map((desc, index) => (
                          <div key={index} className="d-flex gap-2 mb-2">
                            <input
                              type="text"
                              name={`description[${index}]`}
                              className={`form-control ${styles.formControl}`}
                              value={desc}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            {values.description.length > 1 && (
                              <button
                                type="button"
                                className={`btn btn-outline-danger btn-sm`}
                                onClick={() => remove(index)}
                              >
                                &times;
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className={`btn btn-outline-secondary btn-sm mt-2 ${styles.secondaryButton}`}
                          onClick={() => push('')}
                        >
                          + Add Description Line
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  {errors.description && typeof errors.description === 'string' && (
                    <div className={styles.errorText}>{errors.description}</div>
                  )}
                </div>

                {/* Buttons */}
                <div className={`d-flex justify-content-end gap-2 ${styles.buttonContainer}`}>
                  <button
                    type="button"
                    className={`btn btn-outline-secondary ${styles.secondaryButton}`}
                    onClick={onHide}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.primaryButton}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
              </Form>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
