import React, { useEffect, useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from './UpdateTeam.module.css';

export default function UpdateTeam({ show, onHide, competitionId, team, onSuccess }) {
  const [universities, setUniversities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [filteredCoaches, setFilteredCoaches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const validationSchema = Yup.object().shape({
    teamName: Yup.string().required("Team name is required"),
    universityId: Yup.number().required("University is required"),
    coachId: Yup.number().required("Coach is required"),
    ranking: Yup.number().min(1, "Ranking must be at least 1").required("Ranking is required")
  });

  const formik = useFormik({
    initialValues: {
      teamName: team?.teamName || '',
      universityId: team?.universityId || '',
      coachId: team?.coachId || '',
      ranking: team?.ranking || 1
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: updateTeam
  });

  const handleUniversityChange = (e) => {
    const universityId = e.target.value;
    formik.setFieldValue('universityId', universityId);
    formik.setFieldValue('coachId', '');

    if (universityId) {
      const selectedUniversity = universities.find(u => u.universityId === parseInt(universityId));
      const filtered = coaches.filter(c => c.universityName === selectedUniversity?.name);
      setFilteredCoaches(filtered);
    } else {
      setFilteredCoaches(coaches);
    }
  };

  async function updateTeam(values, { setSubmitting }) {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/Teams/Competition/${competitionId}/Update-Team/${team.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success(response.data?.Message || "Team updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess
      });
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data || "Failed to update team", {
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
            <h5 className={`modal-title ${styles.modalTitle}`}>Update Team</h5>
            <button
              type="button"
              className={`btn-close ${styles.closeButton}`}
              onClick={onHide}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={formik.handleSubmit} className={`modal-body ${styles.modalBody}`}>

            <>
              <div className="mb-3">
                <label className="form-label">Team Name</label>
                <input
                  name="teamName"
                  className="form-control"
                  value={formik.values.teamName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.teamName && formik.errors.teamName && (
                  <div className="text-danger mt-1">{formik.errors.teamName}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">University</label>
                <select
                  name="universityId"
                  className="form-control"
                  value={formik.values.universityId}
                  onChange={handleUniversityChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                >
                  <option value="">Select University</option>
                  {universities.map((uni) => (
                    <option key={uni.universityId} value={uni.universityId}>
                      {uni.name}
                    </option>
                  ))}
                </select>
                {formik.touched.universityId && formik.errors.universityId && (
                  <div className="text-danger mt-1">{formik.errors.universityId}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Coach</label>
                <select
                  name="coachId"
                  className="form-control"
                  value={formik.values.coachId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting || !formik.values.universityId}
                >
                  <option value="">Select Coach</option>
                  {filteredCoaches.map((coach) => (
                    <option key={coach.id} value={coach.id}>
                      {coach.name}
                    </option>
                  ))}
                </select>
                {formik.touched.coachId && formik.errors.coachId && (
                  <div className="text-danger mt-1">{formik.errors.coachId}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Ranking</label>
                <input
                  name="ranking"
                  type="number"
                  min="1"
                  className="form-control"
                  value={formik.values.ranking}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.ranking && formik.errors.ranking && (
                  <div className="text-danger mt-1">{formik.errors.ranking}</div>
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
                    "Save"
                  )}
                </button>
              </div>
            </>
          </form>
        </>}

    </Modal>
  );
}