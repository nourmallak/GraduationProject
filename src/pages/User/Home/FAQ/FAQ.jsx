import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FAQ.css";
import faq from '../../../../images/image/faqs.png'
import Loader from "../../../../Loader/Loader";

export default function FAQ() {
  const [faqData, setFaqData] = useState([]); 
  const [activeIndex, setActiveIndex] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  
 
  const getFaq = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/QAA/GetAllQAA`);
      console.log(response.data); 
      setFaqData(response.data); 
    } catch (error) {
      console.log(error);
    }finally{
       setIsLoading(false);
    }
  };

  useEffect(() => {
    getFaq(); 
  }, []); 

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index); 
  };
 if (isLoading) return <Loader />;
  return (
    <>
      <h1 className="faq-heading">FAQ'S</h1>

      <div className="faq">
        <div className="faq-content-container">
          <div className="faq-image">
            <img src={faq} alt="FAQ" />
          </div>

          <div className="faq-container">
            {faqData.map((item, index) => (
              <div className="faq-item" key={index}>
                <div className="faq-title" onClick={() => toggleFAQ(index)}>
                  <div>{item.question}</div>
                  <div>{activeIndex === index ? "-" : "+"}</div>
                </div>
                {activeIndex === index && <div className="faq-content">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
