import React, { useEffect, useState, useContext, createContext } from 'react';
import axios from 'axios';

const authContext = createContext();


export const useAuth = () => {
  return useContext(authContext); 
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  } ,[]); 

  const login = (userData) => {
    setUser(userData); 

    console.log(userData);
    console.log(JSON.stringify(userData));

    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  const signup=async (userDetails)=>{
    const res= await axios.post('http://127.0.0.1:3000/signup', userDetails);

    //error propagation
    return {status: res.status, 
            message: res.data.message};
  }

  const value = { 
    user, 
    login, 
    logout,
    signup
  }; 

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
