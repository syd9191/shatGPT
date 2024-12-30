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

  const login = async (userData) => {
    try{
      const response = await axios.post('http://127.0.0.1:3000/login', userData);
      console.log(response.data);
      setUser(userData); 
      localStorage.setItem('user', JSON.stringify(userData)); 
      return response.data;
      
    } catch (error){
      return {status: error.response.data.status, message: error.response.data.message};
    }
    
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); 
  };

  const signup = async (userData) => {
    try{
      const response = await axios.post('http://127.0.0.1:3000/signup', userData);
      console.log(response.data);
      return response.data; 
    } catch (error){
        return {status: error.response.data.status, message: error.response.data.message}; 
    }
    
};

  const value = { 
    user, 
    login, 
    logout,
    signup
  }; 

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};
