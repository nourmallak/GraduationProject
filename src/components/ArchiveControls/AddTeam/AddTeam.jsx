import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Formik, Field, FieldArray, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../AddTeam/AddTeam.module.css';

export default function AddTeam({ show, onHide, competitionId, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const token = localStorage.getItem("user token")
  async function getUniCouches() {
    try {
      const dataUni = await axios.get(`${import.meta.env.VITE_API}/University/GetAllUniversitiesforRigister`) || '';
      const dataCouch = await axios.get(`${import.meta.env.VITE_API}/Auths/Get-Sub-Admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }) || '';
      setCoaches(dataCouch?.data.subAdminsDtos);
      setFilteredCoaches(dataCouch?.data.subAdminsDtos);
      setUniversities(dataUni?.data);
    } catch (error) {
      console.error("Failed to fetch competitions:", error);
    }
  }
  useEffect(() => {
    const fetchData = async () => await getUniCouches();
    fetchData();
  }, []);

  console.log(coaches);
  const validationSchema = Yup.object().shape({
    teamName: Yup.string().required("Team name is required"),
    universityId: Yup.number().required("University is required"),
    coachId: Yup.number().required("Coach is required"),
    participants: Yup.array()
      .of(
        Yup.object().shape({
          participantName: Yup.string().required("Participant name is required"),
          participantEmail: Yup.string()
            .email("Invalid email format")
            .required("Participant email is required"),
        })
      )
      .min(1, "At least one participant is required"),
    ranking: Yup.number().required("Ranking is required").min(1, "Must be at least 1"),
  });

  const initialValues = {
    teamName: "",
    universityId: "",
    coachId: "",
    participants: [{ participantName: "", participantEmail: "" }],
    ranking: "",
  };

  async function addTeam(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");

      const response = await axios.post(
        `${import.meta.env.VITE_API}/Teams/Add-Team/${competitionId}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response?.data?.Message || "Team added successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Add team error:", error);
      toast.error(error.response?.data || "Failed to add team", {
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

  const handleUniversityChange = (universityId, setFieldValue) => {
    if (universityId) {
      const selectedUniversity = universities.find(
        uni => uni.universityId === parseInt(universityId)
      );

      const filtered = coaches.filter(
        coach => coach.universityName === selectedUniversity?.name
      );

      setFilteredCoaches(filtered);

      if (filtered.length === 1) {
        setFieldValue("coachId", filtered[0].id);
      } else {
        setFieldValue("coachId", "");
      }
    } else {
      setFilteredCoaches(coaches);
      setFieldValue("coachId", "");
    }
  };

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
            <h5 className={`modal-title ${styles.modalTitle}`}>Add Team</h5>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={addTeam}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form className={`modal-body ${styles.modalBody}`}>
                <div className="mb-2">
                  <Field name="teamName" placeholder="Team Name" className="form-control mb-4" />
                  {touched.teamName && errors.teamName && (
                    <div className="text-danger">{errors.teamName}</div>
                  )}
                </div>

                <div className="mb-2">

                  <Field
                    as="select"
                    name="universityId"
                    className="form-control mb-4"
                    onChange={(e) => {
                      setFieldValue("universityId", e.target.value);
                      handleUniversityChange(e.target.value, setFieldValue);
                    }}
                  >
                    <option value="">Select University</option>
                    {universities.map((uni, idx) => (
                      <option key={uni.universityId} value={uni?.universityId}>
                        {uni?.name || `University ${uni.universityId}`}
                      </option>
                    ))}
                  </Field>

                  {touched.universityId && errors.universityId && (
                    <div className="text-danger">{errors.universityId}</div>
                  )}
                </div>

                <div className="mb-2">

                  <Field as="select" name="coachId" className="form-control mb-4">
                    <option value="">Select Coach</option>
                    {filteredCoaches.map((coach, idx) => (
                      <option key={idx} value={coach?.id}>
                        {coach?.name || `Coach ${idx + 1}`}
                      </option>
                    ))}
                  </Field>
                  {touched.coachId && errors.coachId && (
                    <div className="text-danger">{errors.coachId}</div>
                  )}
                </div>

                <FieldArray name="participants">
                  {({ push, remove }) => (
                    <div className="mb-2">
                      <label>Participants:</label>
                      {values.participants.map((_, index) => (
                        <div key={index} >
                          <div className="d-flex gap-2 mb-1">
                            <Field
                              name={`participants.${index}.participantName`}
                              placeholder={`Participant ${index + 1} Name`}
                              className="form-control mb-4"
                            />
                            <Field
                              name={`participants.${index}.participantEmail`}
                              placeholder="Email"
                              className="form-control mb-4"
                            />
                            <button
                              type="button"
                              className={`btn btn-danger btn-sm ${styles.rbtn}`}
                              onClick={() => remove(index)}
                              disabled={values.participants.length === 1}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${styles.addbtn}`}
                              onClick={() => push({ participantName: "", participantEmail: "" })}
                              disabled={values.participants.length >= 3}
                            >
                              +
                            </button>
                          </div>
                          {(touched.participants &&
                            touched.participants[index] &&
                            errors.participants &&
                            errors.participants[index]) && (
                              <div className="text-danger">
                                {touched.participants[index].participantName &&
                                  errors.participants[index].participantName && (
                                    <div>{errors.participants[index].participantName}</div>
                                  )}
                                {touched.participants[index].participantEmail &&
                                  errors.participants[index].participantEmail && (
                                    <div>{errors.participants[index].participantEmail}</div>
                                  )}
                              </div>
                            )}

                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <div className="mb-2">
                  <Field
                    type="number"
                    name="ranking"
                    placeholder="Ranking"
                    className="form-control mb-4"
                  />
                  {touched.ranking && errors.ranking && (
                    <div className="text-danger">{errors.ranking}</div>
                  )}
                </div>

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
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Adding...
                      </>
                    ) : (
                      "Add"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>}

    </Modal>
  );
}