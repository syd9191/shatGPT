import React from 'react';
import ConfirmationWarning from '../ConfirmationWarning/confirmationWarning';
import './chatbotHeader.css';


const ChatbotHeader=({
  tokensUsed,
  dropDownVisible,
  handleProfileClick,
  showLogoutWarning,
  logoutWarningVisible,
  logoutWarningText,
  hideLogoutWarning,
  logout,
  showContextWarning,
  contextWarningVisible,
  handleClearContext,
  contextClearWarningText,
  hideContextWarning
}


)=>(
    <header className="chatbot-header">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <h1>ShatGPT</h1>
    <div>
      <div className="profile-section">
        <img
          src="/user.png"
          alt="Profile"
          className="profile-picture"
          onClick={handleProfileClick}
        />
        {dropDownVisible && (
          <div className="profile-dropdown">
          <p><i className="fas fa-user"></i> Your Profile</p>
          <p><i className="fas fa-cogs"></i> Settings</p>
          <p onClick={showLogoutWarning}><i className="fas fa-sign-out-alt"></i> Log Out</p>
        </div>
        )}
        {logoutWarningVisible && (
          <ConfirmationWarning
            yesButtonPress={logout}
            noButtonPress={hideLogoutWarning}
            warningText={logoutWarningText}
            yesButtonText={"Log Out"}
            noButtonText={"Cancel"}
          />
        )}
      </div>
    </div>
    <div className="tokens-used">
      <p>
        <strong>Tokens Used:</strong> {tokensUsed || "No tokens used yet."}
      </p>
      <button className="clear-context" onClick={showContextWarning}>
        Clear Context
      </button>
    </div>
    {contextWarningVisible && (
      <ConfirmationWarning
        yesButtonPress={handleClearContext}
        noButtonPress={hideContextWarning}
        warningText={contextClearWarningText}
        yesButtonText={"Clear Context"}
        noButtonText={"Cancel"}
      />
    )}
  </header>
);

export default ChatbotHeader;