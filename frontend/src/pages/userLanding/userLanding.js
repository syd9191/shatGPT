import React from 'react';
import {useNavigate} from 'react-router-dom';
import './userLanding.css'

const UserLanding = ()=>{

    const navigate=useNavigate();

    const navigateToLogIn=()=>{
        navigate('/login')
        return;
    };

    const navigateToSignUp=()=>{
        navigate('/signup') //TODO: UP THE DB THEN DO THIS
        return;
    };

    return (
        <>
            <div className='login-container'>
                <h2>
                    Welcome to ShatGPT
                </h2>
                <div className='.user-landing-buttons'>
                    <button type="button" onClick={navigateToLogIn}>Log In</button>
                    <button type="button" onClick={navigateToSignUp}>Sign Up</button> 
                </div>
                
            </div>
              
        </>
        
    )
};

export default UserLanding;
