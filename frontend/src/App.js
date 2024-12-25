
import './App.css';
import React, {useState} from 'react';
import axios from 'axios'; //This is for getting post req from the other server


function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');

  const sendMessage= async () => {
    const reply= await axios.post('http://localhost:3000/api/chatbot', { userMessage: message });
    setReply(reply.data.chatBotReply);
    console.log("hello");

  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Chatbot</h1>
            <div>
              <input type="text" 
                value={message} 
                onChange={(newMessage)=>setMessage(newMessage.target.value)}
                placeholder="Type your message"
                style={{ padding: '10px', width: '70%' }} />
              <button 
              onClick={sendMessage}
              style={{
                padding: '10px',
                marginLeft: '10px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
            }}>
              Send
            </button>
            </div>


            <div style={{ marginTop: '20px' }}>
                <strong>Bot Reply:</strong> {reply || 'No reply yet'}
            </div>

    </div>

            
    
  );
}

export default App;
