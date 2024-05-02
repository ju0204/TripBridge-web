import React from 'react';
import './imageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content">
                <img src={imageUrl} alt="Modal" className="modal-image" />
            </div>
        </div>
    );
};

export default ImageModal;
