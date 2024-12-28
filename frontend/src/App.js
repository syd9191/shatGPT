
import './App.css';
import React, {useState} from 'react';
import axios from 'axios'; //This is for getting post req from the other server


function App() {
  const [userMessage, setUserMessage] = useState('');
  const [gptReply, setgptReply] = useState('');
  const [tokensUsed, setTokensUsed]= useState(0);


  const sendUserMessage= async () => {
    const chatResponse= await axios.post('http://127.0.0.1:3000/api/chatbot', { message : userMessage });

    //logging the whole object: reference available in the UML diagram
    console.log(chatResponse.data.replyDetailsObj); 
    console.log(chatResponse.data.tokenUsageObj);

    setgptReply(chatResponse.data.replyDetailsObj.content);
    setTokensUsed(chatResponse.data.tokenUsageObj.total_tokens);
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Chatbot</h1>
            <div>
              <input type="text" 
                value={userMessage} 
                onChange={(newUserMessage)=>setUserMessage(newUserMessage.target.value)}
                placeholder="Type your message"
                style={{ padding: '10px', width: '70%' }} />
              <button 
              onClick={sendUserMessage}
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
                <strong>Bot Reply:</strong> {gptReply || 'No reply yet'}
                <br /> 
                <strong>Tokens Used:</strong> {tokensUsed || 'No tokens used yet'}

            </div>

    </div>

            
    
  );
}

export default App;
