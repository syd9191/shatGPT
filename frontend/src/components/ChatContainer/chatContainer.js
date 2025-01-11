import React from 'react';
import './chatContainer.css';
import ReactMarkdown from 'react-markdown';

const ChatContainer = (
    {conversationHistory, 
        userMessage, 
        setUserMessage, 
        sendUserMessage, 
        sendButtonRef
    }
)=>{
    return (
        <div className="chat-container">
          <div className="chat-display">
            {/* Render conversation history */}
            {conversationHistory.conversation && conversationHistory.conversation.length > 0 ? (
              conversationHistory.conversation.map((message, index) => (
                <div key={index} className={`chat-message ${message.role === 'user' ? 'user-message' : 'other-message'}`}>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ))
            ) : (
              <p>No conversation history available.</p>
            )}
          </div>
      
          <div className="chat-input">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendUserMessage} ref={sendButtonRef}>Send</button>
          </div>
        </div>
      );
};

export default ChatContainer;