import {useAuth} from '../../context/authContext' ;
import React,  {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './signup.css';


const SignupPage = () =>{

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [error, setError] = useState(null);

    const {signup}= useAuth();
    const navigate= useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault(); //This prevents the browser from auto reloading the page when the form is submitted, and to wait for the auth

        if (!username||!password){
            setError("Both Usernames and Passwords are required!");
            return;
        }

        const userData={username:username.toString(), password:password.toString()};
        
        try {
            const res = await signup(userData);
            console.log(res);
            if (res.status !== 200) {
                setError(res.message); 
            } else {
                console.log("New User Signup");
                navigate("/login");
            }
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    return(
        <div className="signup-container">
            <h2>Create New User</h2>
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
    )
}



export default SignupPage;