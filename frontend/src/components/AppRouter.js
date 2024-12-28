import { useAuth } from "../context/authContext";
import {Routes, Route} from 'react-router-dom';
import React from 'react';
import LoginPage from "../pages/login/login";
import ChatbotPage from "../pages/chatBot/chatbot";

const AppRouter = () =>{
    console.log("AppRouter Working");
    const {user}=useAuth();

    return(
        <Routes>
            <Route path="/" element={user ? <ChatbotPage /> : <LoginPage />} />
            <Route path="/chatbot" element={user ? <ChatbotPage /> : <LoginPage />} />
        </Routes>
    )
}

export default AppRouter;
