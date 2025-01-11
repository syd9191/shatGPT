import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import ConfirmationWarning from '../ConfirmationWarning/confirmationWarning';
import './conversationsList.css';


const ConversationsList=({
    setConversationHistory,
    setTokensUsed,
    conversationBarVisible
})=>{

    const {user}=useAuth();

    const [newConversationTitle, setNewConversationTitle]= useState('');
    const [userConversationsList, setUserConversationsList]= useState([]);
    const [deleteConvoWarningVisible, setDeleteConvoWarningVisible]= useState(false);
    const [deleteConvoTitle, setDeleteConvoTitle]=useState(null);
    const [deleteConvoID, setDeleteConvoID]=useState(null);
    

    const handleSelectConversation= async (conversation_id)=>{
        try{

            const response= await axios.post("http://127.0.0.1:3000/get-conversation-history", {conversation_id:conversation_id});
            const conversationHistory= response.data.conversationHistory;
            if (response.data.status===200){
                setConversationHistory(conversationHistory);
                setTokensUsed(conversationHistory.totalTokens);
                setNewConversationTitle('');
            }
            else{
                console.log("Backend Error, Status: ", response.data.status, ", Error Message: ", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching conversationHistory:", error);
        }
    };

    const handleDeleteConversationButtonPress=(conversationID, conversationTitle)=>{
        setDeleteConvoWarningVisible(!deleteConvoWarningVisible);
        setDeleteConvoTitle(conversationTitle);
        setDeleteConvoID(conversationID);
        
    };

    const toggleDeleteConvoWarning=()=>{
        setDeleteConvoWarningVisible(!deleteConvoWarningVisible);
    }



    const handleUpdateConversation=async (newConversationsList)=>{
        //updates userConversationList
        try{
            await axios.post('http://127.0.0.1:3000/update-user-conversations', {
                user_id:user.user_id,
                conversationsList:newConversationsList
            });
        } catch (error){
            console.error("Error Updating User Conversations:", error);
        }
    }

    const handleDeleteConversation=async ()=>{
        try{
            const updatedUserConversationList=userConversationsList.filter(convo => convo.conversation_id !== deleteConvoID)
            setUserConversationsList(updatedUserConversationList);
            const response= await axios.post('http://127.0.0.1:3000/delete-conversation', {conversationID: deleteConvoID});
            handleUpdateConversation(updatedUserConversationList);
            if (response.data.status===200){
                toggleDeleteConvoWarning();
                setDeleteConvoTitle(null);
                setDeleteConvoID(null);
                console.log("Conversation Successfully Deleted!");
            } else {
                console.log("Backend Error, Status: ", response.data.status, ", Error Message: ", response.data.message);
            }
        } catch (error) {
            console.error("Error Deleting Conversation History:", error);
        }
    }


    const handleCreateConversation=async ()=>{
        try{
        const response=await axios.post('http://127.0.0.1:3000/create-conversation-history', {user_id: user.user_id, title:newConversationTitle});
        if (response.data.status===200){
            const createdConversation=response.data.conversationHistory;
            const newConversationInList= {
                conversation_id:createdConversation._id,
                title:newConversationTitle 
            };
            const newUserConversationsList=[...userConversationsList, newConversationInList];
            await axios.post('http://127.0.0.1:3000/update-user-conversations', {
                user_id:user.user_id,
                conversationsList:newUserConversationsList
            });
            
            setUserConversationsList(newUserConversationsList);
            setConversationHistory(createdConversation);
            setNewConversationTitle('');
        } else {
            console.log("There is an error in the backend server, status: ", response.data.status, "message: ", response.data.message);
        }
        } catch (error) {
            console.error("Error Creating Conversation:", error);
            
        }

    };

    useEffect(()=>{
        if (!user.user_id) return; // Ensure user_id is available
        const fetchUserConversations=async()=>{
            try{
                const response=await axios.post('http://127.0.0.1:3000/get-user-conversations', {user_id: user.user_id});
                if (response.data.status===200){
                    setUserConversationsList(response.data.userConversation.conversationsList);
                }
                else{
                    console.log("Backend Error, Status: ", response.data.status, ", Error Message: ", response.data.message);
                }
            } catch (error){
                console.error("Error fetching user conversations:", error);
            }
        };
        fetchUserConversations();
    }, [user.user_id]);

    return (
        <div className={`conversation-bar ${conversationBarVisible ? "visible" : ""}`}>
          {/* Input for creating a new conversation */}
          <div className="create-conversation">
            <input
              type="text"
              value={newConversationTitle}
              placeholder="Enter New Conversation Title..."
              onChange={(e) => setNewConversationTitle(e.target.value)}
            />
            <i className="fa-solid fa-plus-circle" onClick={handleCreateConversation}></i>
          </div>
      
          {/* Render conversation list */}
          {userConversationsList && userConversationsList.length > 0 ? (
            userConversationsList.map((conversation) => (
              <div
                key={conversation.conversation_id}
                className="conversation-item"
                onClick={() => handleSelectConversation(conversation.conversation_id)}
              >
                <p>{conversation.title}</p>
                <button className="delete-button" onClick={() => handleDeleteConversationButtonPress(conversation.conversation_id, conversation.title)}>
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))
          ) : (
            <p className="no-conversations-message">No conversations yet. Create one!</p>
          )}
          {deleteConvoWarningVisible&&(
            <ConfirmationWarning
            yesButtonPress={handleDeleteConversation}
            noButtonPress={toggleDeleteConvoWarning}
            yesButtonText={"Delete Convo"}
            noButtonText={"Cancel"}
            warningText={`Are you sure you want to Delete Conversation: ${deleteConvoTitle}`}></ConfirmationWarning>
          )}
        </div>
      );
    };

    

export default ConversationsList;