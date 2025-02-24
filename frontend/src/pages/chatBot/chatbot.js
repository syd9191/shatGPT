import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import ChatbotHeader from '../../components/ChatbotHeader/chatbotHeader';
import ChatContainer from '../../components/ChatContainer/chatContainer';
import ConversationsMenu from '../../components/ConversationsMenu/conversationsMenu';
import './chatbot.css';

const ChatbotPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [isSending, setIsSending]= useState(false);
  const [conversationHistory, setConversationHistory]=useState([]);
  const [contextWarningVisible, setContextWarningVisible]=useState(false);
  const [logoutWarningVisible, setLogoutWarningVisible]=useState(false);
  const [dropDownVisible, setDropDownVisible]= useState(false);
  const [conversationBarVisible, setConversationBarVisible]= useState(false);


  const {logout} = useAuth();
  const sendButtonRef = useRef(null);

 // Include dependencies


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
      console.log(conversationHistory);
      const newConversationHistory = {
        ...conversationHistory, 
        conversation: [...conversationHistory.conversation, { "role": "user", "content": userMessage }],
        latestMessage: userMessage,
        lastUpdated: new Date().toISOString()
      };
      console.log('conversationHistory being sent: ', newConversationHistory);
      setIsSending(true);
      

      const chatResponse = await axios.post('http://127.0.0.1:3000/api/chatbot', {conversationHistory: newConversationHistory});
      console.log("Chat Response:", chatResponse.data);

      setTokensUsed(chatResponse.data.totalTokens);
      setConversationHistory(chatResponse.data);

      console.log('GPT REPLY: ' , chatResponse.data.latestMessage);
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

  const handleClearContext = async()=>{
    const clearedConversationhistory={
      _id: conversationHistory._id, 
      conversation: [], 
      createdAt: conversationHistory.createdAt,
      lastUpdated: new Date().toISOString(),
      totalTokens: 0,
      latestMessage: "",
      user_id: conversationHistory.user_id,
      title: conversationHistory.title
    };
    const response=await axios.post("http://127.0.0.1:3000/clear-conversation", {conversationHistory: clearedConversationhistory});
    if (response.status===200){
      setConversationHistory(clearedConversationhistory);
    }else{
      console.log(response.message);
    }
    
    setTokensUsed(0);
    console.log("Conversational Context RESET: ", clearedConversationhistory);
    hideContextWarning();
  };

  const showContextWarning = ()=>{
    setContextWarningVisible(true);
  };

  const hideContextWarning = ()=>{
    setContextWarningVisible(false);
  };

  const showLogoutWarning = ()=>{
    setLogoutWarningVisible(true);
  };

  const hideLogoutWarning = ()=>{
    setLogoutWarningVisible(false);
  };

  const toggleDropDown=()=>{
    setDropDownVisible(!dropDownVisible);
  }

  const handleProfileClick=()=>{
    toggleDropDown();
  };

  const contextClearWarningText="Are You Sure? This Conversation will be ERASED!";
  const logoutWarningText="Are you sure you want to Log Out?";


  return (
    <div className="chatbot-page">
      <ChatbotHeader
       tokensUsed={tokensUsed}
       dropDownVisible={dropDownVisible}
       handleProfileClick={handleProfileClick}
       showLogoutWarning={showLogoutWarning}
       logoutWarningVisible={logoutWarningVisible}
       logoutWarningText={logoutWarningText}
       hideLogoutWarning={hideLogoutWarning}
       logout={logout}
       showContextWarning={showContextWarning}
       contextWarningVisible={contextWarningVisible}
       handleClearContext= {handleClearContext}
       contextClearWarningText={contextClearWarningText}
       hideContextWarning={hideContextWarning}
       setConversationHistory={setConversationHistory}
       setTokensUsed={setTokensUsed}
      />

  
      <ChatContainer
        conversationHistory={conversationHistory}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        sendUserMessage={sendUserMessage}
        sendButtonRef={sendButtonRef}
      />

      <ConversationsMenu 
        conversationBarVisible={conversationBarVisible}
        setConversationBarVisible={setConversationBarVisible}
        setConversationHistory={setConversationHistory}
        setTokensUsed={setTokensUsed}
      />
    </div>
  );
};

export default ChatbotPage;
