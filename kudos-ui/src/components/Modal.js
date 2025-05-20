// import React from 'react';
// import './Modal.css';

// function Modal({ isOpen, onClose, children }) {
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={e => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>&times;</button>
//         {children}
//       </div>
//     </div>
//   );
// }

// export default Modal;


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

