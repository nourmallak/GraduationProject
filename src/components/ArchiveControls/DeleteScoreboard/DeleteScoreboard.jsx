import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import styles from '../DeleteScoreboard/DeleteScoreboard.module.css';

export default function DeleteScoreboard({ show, onHide, competition, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const handleDelete = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("user token");

            const response = await axios.put(
                `${import.meta.env.VITE_API}/Compitions/Delete-ScoreBoard-Image/${competition.idForCompetition}`,{},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            onSuccess();

            toast.success(response.data || "Scoreboard deleted successfully", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastSuccess
            });
            onHide();
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error.response || "Failed to delete Scoreboard", {
                position: "bottom-right",
                autoClose: 5000,
                transition: Bounce,
                className: styles.toastError
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static" className={styles.modal}>
            {loading ?
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
                :
                <>
                    {/* Modal Header */}
                    <div className={`modal-header ${styles.modalHeader}`}>
                        <h5 className={`modal-title ${styles.modalTitle}`}>Delete Scoreboard</h5>
                        <button
                            type="button"
                            className={`btn-close ${styles.closeButton}`}
                            onClick={onHide}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className={`modal-body ${styles.modalBody}`}>
                        <p className={styles.confirmationText}>
                            Are you sure you want to delete this Scoreboard?
                        </p>

                        {/* Buttons */}
                        <div className={`d-flex justify-content-end gap-2 ${styles.buttonContainer}`}>
                            <button
                                type="button"
                                className={`btn btn-outline-secondary ${styles.secondaryButton}`}
                                onClick={onHide}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`btn btn-danger ${styles.primaryButton}`}
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            className={styles.spinner}
                                        />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                        </div>
                    </div>
                </>}

        </Modal>
    );
}

