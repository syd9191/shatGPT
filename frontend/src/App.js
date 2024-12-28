
import './App.css';
import React from 'react';
import AppRouter from './components/AppRouter';
import { AuthProvider } from './context/authContext';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter/>
      </BrowserRouter>
    </AuthProvider>
  )

}

export default App;
