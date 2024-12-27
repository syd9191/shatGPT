
import './App.css';
import React, {useState} from 'react';
import axios from 'axios'; //This is for getting post req from the other server


function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [tokensUsed, setTokensUsed]= useState(0);


  const sendMessage= async () => {
    const reply= await axios.post('http://127.0.0.1:3000/api/chatbot', { message : message });
    console.log(reply.data.chatBotReply);
    console.log(reply.data.total_tokens);

    setReply(reply.data.chatBotReply.content);
    setTokensUsed(reply.data.total_tokens);
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
                <br /> 
                <strong>Tokens Used:</strong> {tokensUsed || 'No tokens used yet'}

            </div>

    </div>

            
    
  );
}

export default App;
