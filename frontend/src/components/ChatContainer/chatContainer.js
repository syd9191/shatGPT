import React from 'react';
import './chatContainer.css';

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
                    <div key={index}>
                    <p>
                        <strong>{message.role}:</strong> {message.content}
                    </p>
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
            <button onClick={sendUserMessage}
            ref={sendButtonRef}>Send</button>
            </div>
        </div>
    )
};

export default ChatContainer;