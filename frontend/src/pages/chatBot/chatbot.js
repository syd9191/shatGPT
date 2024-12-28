import React, { useState } from 'react';
import axios from 'axios';
import {useAuth} from '../../context/authContext';
import './chatbot.css';


const ChatbotPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [gptReply, setGptReply] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const {logout}= useAuth();


  const sendUserMessage = async () => {
    try {
      const chatResponse = await axios.post('http://127.0.0.1:3000/api/chatbot', { message: userMessage });

      console.log(chatResponse.data.replyDetailsObj);
      console.log(chatResponse.data.tokenUsageObj);

      setGptReply(chatResponse.data.replyDetailsObj.content);
      setTokensUsed(chatResponse.data.tokenUsageObj.total_tokens);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container">
      <h1>Chatbot</h1>

      <div className="input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button onClick={sendUserMessage}>Send</button>
      </div>

      <div className="response-section">
        <strong>Bot Reply:</strong> <p>{gptReply || 'No reply yet'}</p>
        <strong>Tokens Used:</strong> <p>{tokensUsed || 'No tokens used yet'}</p>

        <button className="logout-button" onClick={logout}>Log Out</button>
      </div>
    </div>
  );
};


export default ChatbotPage;