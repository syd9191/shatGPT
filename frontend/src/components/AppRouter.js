import { useAuth } from "../context/authContext";
import {Routes, Route} from 'react-router-dom';
import React from 'react';
import LoginPage from "../pages/login/login";
import SignupPage from "../pages/signup/signup";
import ChatbotPage from "../pages/chatBot/chatbot";
import UserLanding from "../pages/userLanding/userLanding";

const AppRouter = () =>{
    console.log("AppRouter Working");
    const {user}=useAuth();

    return(
        <Routes>
            <Route path="/" element={user ? <ChatbotPage /> : <UserLanding />} />
            <Route path="/chatbot" element={user ? <ChatbotPage /> : <UserLanding />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
        </Routes>
    )
}

export default AppRouter;
