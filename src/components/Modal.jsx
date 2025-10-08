// src/components/Modal.jsx
import React from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null; // Don't render anything if the modal is closed
  }

  // We use a portal here in a real app, but for simplicity, this is fine.
  // The e.stopPropagation() prevents the modal from closing if you click inside it.
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        {/* Wrap the content in the new scrollable body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;