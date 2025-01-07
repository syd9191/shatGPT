import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import ChatbotHeader from '../../components/ChatbotHeader/chatbotHeader';
import ChatContainer from '../../components/ChatContainer/chatContainer';
import ConversationsList from '../../components/ConversationsList/conversationsList';
import './chatbot.css';

const ChatbotPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [tokensUsed, setTokensUsed] = useState(0);
  const [isSending, setIsSending]= useState(false);
  const [conversationHistory, setConversationHistory]=useState([]);
  const [contextWarningVisible, setContextWarningVisible]=useState(false);
  const [logoutWarningVisible, setLogoutWarningVisible]=useState(false);
  const [dropDownVisible, setDropDownVisible]= useState(false);


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
    
          setTokensUsed(response.data.conversationHistory.totalTokens);
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
      conversation: [], 
      createdAt: conversationHistory.createdAt,
      lastUpdated: new Date().toISOString(),
      totalTokens: 0,
      latestMessage: "",
      user_id: conversationHistory.user_id,
      __v: conversationHistory.__v, 
      _id: conversationHistory._id
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

  const conversations = [
    {
      id: 1,
      title: 'Conversation 1',
      lastMessage: 'Hey, how are you?',
      createdAt: '2025-01-01',
    },
    {
      id: 2,
      title: 'Conversation 2',
      lastMessage: 'What’s the weather today?',
      createdAt: '2025-01-02',
    },
    {
      id: 3,
      title: 'Conversation 3',
      lastMessage: 'Can you help me with a task?',
      createdAt: '2025-01-03',
    },
  ];

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
      />

      <ConversationsList
      setConversationHistory={setConversationHistory}
      conversations={conversations}>
      </ConversationsList>

    
  
      <ChatContainer
        conversationHistory={conversationHistory}
        userMessage={userMessage}
        setUserMessage={setUserMessage}
        sendUserMessage={sendUserMessage}
        sendButtonRef={sendButtonRef}
      />
    </div>
  );
};

export default ChatbotPage;
