import {useAuth} from '../../context/authContext' ;
import React,  {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';


const LoginPage = () =>{

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);

    const {login}= useAuth();
    const navigate= useNavigate();

    const handleBack = ()=>{
        navigate('/');
    }

    const handleSubmit = async (e)=>{
        e.preventDefault(); //This prevents the browser from auto reloading the page when the form is submitted, and to wait for the auth

        if (!username||!password){
            setError("Both Usernames and Passwords are required!");
            return;
        }

        const userData={username: username, password:password};
        
        try{
            const loginRes= await login(userData);
            console.log(loginRes);
            if (loginRes.status===401){
                navigate("/login");
                setError(loginRes.message);
            }else{
                navigate("/"); //we try to navigate to the home page first probably need to change at a later time
            }
        } catch (err){
            navigate("/login");
            setError('Invalid credentials, please try again!'); //different error handling
        }
    }

    return(
        <>
        <div className="login-container">
            <button className="back-button" onClick={handleBack}>← Back Home</button>

            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>


            <div className="form-group">
                <label htmlFor="exampleUsername">Username</label>
                <input type="text" 
                className="form-control" 
                id="exampleUsername" 
                placeholder="Enter Username" 
                onChange={(e)=> setUsername(e.target.value)}/>
            </div>

            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" 
                className="form-control" 
                id="exampleInputPassword1" 
                placeholder="Password" 
                onChange={(e)=>setPassword(e.target.value)}/>
            </div>

            {error && <p className="error">{error}</p>} {/* Display error message if any */}

            <button type="submit" className="btn btn-primary">Log In</button>

            </form>
        </div>
        </>
        
    )
}



export default LoginPage;