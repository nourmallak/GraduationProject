import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import "./UpdateFAQ.css";

export default function EditFaq() {
  const navigate = useNavigate();
  const location = useLocation();
  const { faq } = location.state || {};
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false); // حالة نافذة التأكيد
  const [actionType, setActionType] = useState(null); // لتحديد ما إذا كانت الحفظ أو الإلغاء
  const token = localStorage.getItem("user token");

  const handleUpdate = async () => {
    try {
      const updatedFaq = { ...faq, question, answer };
      const response = await axios.put(
        `${import.meta.env.VITE_API}/QAA/UpdateQAA/${faq?.id}`,
        JSON.stringify(updatedFaq),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Question and Answer updated successfully", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        navigate("/dashboard/faq");
      }
    } catch (err) {
      toast.error("Failed to update FAQ!", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const openConfirmationModal = (action) => {
    setActionType(action);
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
    setActionType(null);
  };

  const handleConfirmAction = () => {
    if (actionType === "save") {
      handleUpdate();
    } else if (actionType === "cancel") {
      navigate("/dashboard/faq");
    }
    closeConfirmationModal();
  };

  return (
    <div className="modal-update-faq">
      <div className="modal-content-update-faq">
        <h3>Update Question</h3>
        <div className="form-group-update-faq">
          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter Question"
          />
        </div>
        <div className="form-group-update-faq">
          <label>Answer</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter Answer"
            rows={5}
          />
        </div>
        <div className="form-actions-update-faq">
        <button onClick={() => openConfirmationModal("save")} className="save-btn-update-faq">
  Save Changes
</button>

          <button onClick={() => openConfirmationModal("cancel")} className="close-btn-update-faq">
            Cancel
          </button>
        </div>
      </div>

      {/* Modal Confirmation */}
      {isConfirmationModalOpen && (
        <div className="confirmation-modal-update-faq">
          <div className="confirmation-modal-content-update-faq">
            <h3>
              Are you sure you want to {actionType === "save" ? "save" : "cancel"}?
            </h3>
            <div className="confirmation-modal-actions-update-faq">
              <button onClick={handleConfirmAction} className="confirm-btn-update-faq">
                Yes
              </button>
              <button onClick={closeConfirmationModal} className="cancel-btn-update-faq">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
