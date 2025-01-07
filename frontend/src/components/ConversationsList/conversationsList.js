import React, { useState } from 'react';

const ConversationsList=({
    setConversationHistory,
    conversations
})=>{
    
    const [newConversationTitle, setNewConversationTitle]= useState('');

    const handleSelectConversation=(conversationHistory)=>{
        setConversationHistory(conversationHistory);
        setNewConversationTitle('');
    };

    const handleCreateConversation=()=>{
        console.log("TODO: ADD CREATE CONVERSATION ENDPOINT HERE");
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

            {conversations.map((conversation)=>(
                <div 
                key={conversation.id}
                className="conversation-item"
                onClick={()=>handleSelectConversation(conversation)}> 
                <p>{conversation.title}</p>
                </div>
            ))}
        </div>
    )
};

export default ConversationsList;