import React from 'react'
import './confirmationWarning.css'


const ConfirmationWarning = ({handleClearContext, hideWarning, warningText}) => {
    return (
      <div className="confirmation-warning">
        <div className="warning-text">
          <h3>{warningText}</h3>
        </div>
  
        <div className="button-container">
          <button className="confirm-yes" onClick={handleClearContext}>
            Yes
          </button>
          <button className="confirm-no" onClick={hideWarning}>
            No
          </button>
        </div>
      </div>
    );
  };
  
  export default ConfirmationWarning;