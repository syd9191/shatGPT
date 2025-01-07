import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/authContext';


const ConversationsList=({
    setConversationHistory,
    setTokensUsed
})=>{

    const {user}=useAuth();

    const [newConversationTitle, setNewConversationTitle]= useState('');
    const [userConversationsList, setUserConversationsList]= useState([]);
    

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

    useEffect(()=>{
        if (!user?.user_id) return; // Ensure user_id is available
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
    }, [!user?.user_id]);


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

    return (
        <div className="conversation-bar">
            <div className="create-conversation">
                <input
                type="text"
                value={newConversationTitle}
                onChange={(e)=>setNewConversationTitle(e.target.value)}
                />
                <button 
                onClick={handleCreateConversation}
                >Create New Conversation
                </button>
            </div>

            {userConversationsList.map((conversation)=>(
                <div 
                key={conversation.conversation_id}
                className="conversation-item"
                onClick={()=>handleSelectConversation(conversation.conversation_id)}> 
                <p>{conversation.title}</p>
                </div>
            ))}
        </div>
    )
};

export default ConversationsList;