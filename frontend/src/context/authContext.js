import React, { useEffect, useState, useContext, createContext } from 'react';
import axios from 'axios';


const authContext = createContext();

const backendURL=process.env.REACT_APP_BACKEND_SERVER_URL;

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
      const response = await axios.post(`${backendURL}/login`, userData);
      console.log(response.data);

      const newUser = {
        user: userData.username,
        password: userData.password,
        user_id: response.data.user_id
      }
      
      setUser(newUser); 
      localStorage.setItem('user', JSON.stringify(newUser)); 
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
      const response = await axios.post(`${backendURL}/signup`, userData);
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
