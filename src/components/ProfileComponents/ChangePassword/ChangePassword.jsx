import React, { useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import styles from "../ChangePassword/ChangePassword.module.css";

export default function ChangePassword({ show, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateField = (fieldName, value) => {
    let message = "";
    switch (fieldName) {
      case "currentPassword":
        if (!value.trim()) message = "Current password is required";
        break;
      case "newPassword":
        if (!value.trim()) message = "New password is required";
        else if (value.length < 6) message = "Password must be at least 6 characters";
        break;
      case "confirmPassword":
        if (value !== newPassword) message = "Passwords do not match";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: message }));
  };

  const validateAll = () => {
    const validationErrors = {};
    if (!currentPassword.trim()) validationErrors.currentPassword = "Current password is required";
    if (!newPassword.trim()) validationErrors.newPassword = "New password is required";
    else if (newPassword.length < 6) validationErrors.newPassword = "Password must be at least 6 characters";
    if (confirmPassword !== newPassword) validationErrors.confirmPassword = "Passwords do not match";
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("user token");
      const payload = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      };

      await axios.post(
        `${import.meta.env.VITE_API}/Auths/Change-Password`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password changed successfully", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastSuccess,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      onClose();
    } catch (error) {
      toast.error(error.response?.data || "Failed to change password", {
        position: "bottom-right",
        autoClose: 5000,
        transition: Bounce,
        className: styles.toastError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      className={styles.modal}
    >
      {isLoading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Changing password...</p>
        </div>
      ) : (
        <>
          <div className={`modal-header ${styles.modalHeader}`}>
            <h5 className="modal-title">Change Password</h5>
          </div>

          <form onSubmit={handleSubmit} className={`modal-body ${styles.modalBody}`}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                value={currentPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPassword(value);
                  validateField("currentPassword", value);
                }}
                disabled={isLoading}
              />
              {errors.currentPassword && <div className="invalid-feedback">{errors.currentPassword}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  validateField("newPassword", value);
                  // إعادة التحقق من تأكيد كلمة المرور عند تغيير الجديدة
                  if (confirmPassword) validateField("confirmPassword", confirmPassword);
                }}
                disabled={isLoading}
              />
              {errors.newPassword && <div className="invalid-feedback">{errors.newPassword}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                value={confirmPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setConfirmPassword(value);
                  validateField("confirmPassword", value);
                }}
                disabled={isLoading}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className={`d-flex justify-content-end gap-2 ${styles.buttonContainer}`}>
              <button
                type="button"
                className={`btn btn-outline-secondary ${styles.secondaryButton}`}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-primary ${styles.primaryButton}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className={styles.spinner}
                    />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
