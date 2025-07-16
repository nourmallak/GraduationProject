import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./FAQAdmin.css";
import { FaTrash, FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import faqLogo from "../../../images/image/FAQs-amico.svg";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Loader from "../../../Loader/Loader";

export default function FAQAdmin() {
  const { register, handleSubmit, reset } = useForm();
  const [editingIndex, setEditingIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("user token");

  const getFaq = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/QAA/GetAllQAA`);
      setFaqData(response.data);
    } catch (error) {
      console.log(error);
    }finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    getFaq();
  }, []);

  const addFaq = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/QAA/AddQAA`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("user token")}`,
          },
        }
      );
      Swal.fire({
        icon: "success",
        title: "FAQ Added Successfully!",
        text: response.data,
      });
      getFaq();
      reset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to add FAQ!",
        text: err.message,
      });
    }
  };

  const handleEdit = async (index, faqId) => {
    const updatedFaq = faqData[index];
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/QAA/UpdateQAA/${faqId}`,
        JSON.stringify(updatedFaq),
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        getFaq();
        Swal.fire({
          icon: "success",
          title: "FAQ Updated Successfully!",
        });
        setEditingIndex(null);
        reset();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update FAQ!",
        text: err.message,
      });
    }
  };

  const deleteFaq = async (faqId) => {
    Swal.fire({
      title: 'Are you sure you want to delete this FAQ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#f8800f",
      cancelButtonColor: "red", 
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        icon: 'custom-swal-icon'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API}/QAA/DeleteQAA/${faqId}`,
            {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          Swal.fire({
            icon: "success",
            title: "FAQ Deleted Successfully!",
            text: response.data,
          });
          getFaq(); 
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Failed to delete FAQ!",
            text: err.message,
          });
        }
      }
    });
  };

  const toggleAccordion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
   if (isLoading) return <Loader />;

  return (
    <div className="faq-container-ex">
      <h2 className="faq-title-manger">Manage FAQs</h2>

      <div className="faq-container-manger">
        <div className="faq-content-manger">
          <form
            onSubmit={handleSubmit(
              editingIndex !== null
                ? (data) => handleEdit(editingIndex, faqData[editingIndex].id)
                : addFaq
            )}
            className="faq-form-manger"
          >
            <input
              type="text"
              placeholder="Question"
              {...register("question", { required: true })}
              className="faq-input-manger"
            />
            <textarea
              placeholder="Answer"
              {...register("answer", { required: true })}
              className="faq-textarea-manger"
            />
            <button type="submit" className="faq-button-manger">
              {editingIndex !== null ? "Update FAQ" : "Add FAQ"}
              <FaPlus className="icon-plus-manger" />
            </button>
          </form>

          <div className="faq-list-manger">
            {faqData.map((faq, index) => (
              <div className="faq-item-manger" key={faq.id}>
                <div className="faq-header-manger">
                  <div
                    className="faq-question-manger"
                    onClick={() => toggleAccordion(index)}
                  >
                    {faq.question}
                  </div>
                  <div className="faq-actions-manger">
                    <button
                      className="edit-btn-manger"
                      onClick={() =>
                        navigate("/dashboard/edit-faq", {
                          state: { faq: faqData[index] },
                        })
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn-manger-faq"
                      onClick={() => deleteFaq(faq.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="close-btn-manger-faq"
                      onClick={() => toggleAccordion(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                {activeIndex === index && (
                  <div className="faq-answer-manger">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="faq-image-manger">
          <img src={faqLogo} alt="FAQ Illustration" />
        </div>
      </div>
    </div>
  );
}
