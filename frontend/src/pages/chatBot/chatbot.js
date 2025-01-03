import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import './chatbot.css';

const ChatbotPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [gptReply, setGptReply] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [isSending, setIsSending]= useState(false);
  const [conversationHistory, setConversationHistory]= useState(null);
  const {user, logout} = useAuth();
  const sendButtonRef = useRef(null);

  useEffect(() => {
    const fetchUserConversation = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:3000/get-user-conversation', {
          user_id: user.user_id,
        });
  
        if (response.data) {
          setConversationHistory(response.data.conversationHistory); // Assuming response.data is the conversation history
          console.log("Conversation History:", response.data.conversationHistory);
        }
      } catch (error) {
        console.error("Error fetching user conversation:", error);
      }
    };
  
    fetchUserConversation();
  }, [user.user_id]); // Include dependencies


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !isSending){
        e.preventDefault();  // Prevent the default Enter key behavior
        sendButtonRef.current?.click();  // Simulate a click on the send button
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSending]);

  
  const sendUserMessage = async () => {
    try {
      if (!userMessage.trim()) {
        console.log("Message Empty");
        return;
      }

      console.log("Sending message from REACT:", userMessage);  // Log the message
      const newConversationHistory = {
        ...conversationHistory, 
        conversation: [...conversationHistory.conversation, { "role": "user", "content": userMessage }]
      };
      console.log(newConversationHistory);
      setIsSending(true);
      

      const chatResponse = await axios.post('http://127.0.0.1:3000/api/chatbot', {conversationHistory: newConversationHistory});
      console.log("Chat Response:", chatResponse.data);

      setGptReply(chatResponse.data.latest_message);
      setTokensUsed(chatResponse.data.total_tokens);
      setConversationHistory(chatResponse.data);

      console.log('GPT REPLY: ' , chatResponse.data.latest_message);
      console.log('Tokens Used', tokensUsed);
    } 
  
    catch (error) {
      console.error("Error sending message:", error);
    } 
    
    finally {
      setIsSending(false);
      setUserMessage('');
    }
  };

  return (
    <div className="chatbot-page">
      <header className="chatbot-header">
        <h1>ShatGPT</h1>
        <button className="logout-button" onClick={logout}>Log Out</button>
      </header>

      <div className="chat-container">
        <div className="chat-display">
          <div className="bot-reply">
            <p><strong>Bot:</strong> { gptReply || "No reply yet."}</p>
          </div>
          <div className="tokens-used">
            <p><strong>Tokens Used:</strong> {tokensUsed || "No tokens used yet."}</p>
          </div>
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
    </div>
  );
};

export default ChatbotPage;
