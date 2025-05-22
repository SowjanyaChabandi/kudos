import React from 'react';
import ReactModal from 'react-modal';

const Modal = ({ isOpen, onRequestClose, children, ...props }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      {...props}
    >
      <div className="modal-header">
        <button className="close-button" onClick={onRequestClose}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </ReactModal>
  );
};

export default Modal;

