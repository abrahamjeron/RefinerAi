import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './components/Auth';
import { UserProvider } from "./context/userContext";
// import './App.css';

function App() {
  return (
    <>  
      <UserProvider>
        <Router>
            <Routes>
              <Route path='/' element={<Auth/>}/>
            </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;