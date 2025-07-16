import React from "react";
import GoPremiumButton from "../GoPremiumButton"; // Import your existing premium button component
import "./GoPremiumModal.css";

const GoPremiumModal = ({ onClose, userId }) => {
  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal">
        <h2>If you want to download more videos, you have to buy Premium.</h2>
        <div className="modal-actions">
          <GoPremiumButton userId={userId} />
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoPremiumModal;
