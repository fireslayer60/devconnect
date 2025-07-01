import React from 'react'
import LoginPage from './Login/LoginPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SinglePostPage from './Home/components/SinglePostPage';
import HomePage from './Home/HomePage';
import VisitPage from './profile/VisitPage';
function App() {
  
  return (
    <Routes>
        <Route path="/" element={<LoginPage/>} /> 
        <Route path="/Home" element={<HomePage/>} /> 
        <Route path="/posts/:id" element={<SinglePostPage />} />
        <Route path="/profile/:id" element={<VisitPage />} />
        
      </Routes>
  )
}

export default App

