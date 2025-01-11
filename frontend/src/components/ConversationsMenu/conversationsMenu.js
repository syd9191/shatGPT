import React from 'react';
import ConversationsList from '../ConversationsList/conversationsList';
import './conversationsMenu.css';




const ConversationsMenu =(
    {
        conversationBarVisible,
        setConversationBarVisible,
        setConversationHistory,
        setTokensUsed
    }
)=>{


    const toggleConversationBar=()=>{
        console.log("Conversations Bar Toggled");
        setConversationBarVisible(!conversationBarVisible);
      };

    return (
    <>
        <div className="conversations-menu">
        <i className="fa-solid fa-bars" onClick={toggleConversationBar}/>
        </div>
        <ConversationsList
        setConversationHistory={setConversationHistory}
        setTokensUsed={setTokensUsed}
        conversationBarVisible={conversationBarVisible}>
        </ConversationsList>
    </>
    );
}

export default ConversationsMenu;