import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa'; 

const faqData = [
  {
    question: "Is my client data secure?",
    answer: "Yes. Security is our highest priority. We use 256-bit AES end-to-end encryption, and our platform is built to be fully compliant with legal data privacy standards. Your data is yours, always."
  },
  {
    question: "What file types do you support?",
    answer: "Jurisynthcan ingest all common file types, including .pdf, .docx, .jpeg, .png, .mp3, .wav, and .m4a files. You can upload scanned documents, photos of evidence, and courtroom audio recordings."
  },
  {
    question: "How accurate is the transcription?",
    answer: "Our AI model (powered by Whisper) achieves over 98% accuracy on clear courtroom audio. It is specifically trained to recognize and correctly transcribe legal terminology, even with various accents."
  },
  {
    question: "Can this integrate with my current case management software?",
    answer: "We are building out our API and integrations. Our Enterprise plan allows for full API access to connect with your existing case management tools. Please contact us for details."
  }
];

function FAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null); 
    } else {
      setOpenFaq(index); 
    }
  };

  return (
    <section id="faq" className="page-section faq-section">
      <div className="faq-container">
        <div className="features-header animate-fade-in-up">
          <h2>Frequently Asked Questions</h2>
          <p>Answering your most common questions about LegalAI.</p>
        </div>

        <div className="faq-list">
          {faqData.map((item, index) => (
            <div className="faq-item" key={index}>
              <button 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
                aria-expanded={openFaq === index}
              >
                <span>{item.question}</span>
                <span className="faq-icon">
                  {openFaq === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              <div className={openFaq === index ? "faq-answer open" : "faq-answer"}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
