import React from 'react'
import './confirmationWarning.css'


const ConfirmationWarning = ({yesButtonPress, noButtonPress, warningText, yesButtonText, noButtonText}) => {
    return (
      <div className="confirmation-warning">
        <div className="warning-text">
          <h3>{warningText}</h3>
        </div>
  
        <div className="button-container">
          <button className="confirm-yes" onClick={yesButtonPress}>
            {yesButtonText}
          </button>
          <button className="confirm-no" onClick={noButtonPress}>
            {noButtonText}
          </button>
        </div>
      </div>
    );
  };
  
  export default ConfirmationWarning;