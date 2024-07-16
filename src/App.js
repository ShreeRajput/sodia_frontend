import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './app.css' 

import Home from "./pages/home/Home"
import Login from "./pages/login/Login"
import Profile from "./pages/profile/Profile"
import Register from "./pages/register/Register"
import Messenger from "./pages/messenger/Messenger.jsx"
import Sodia from "../src/pages/sodia/Sodia.jsx"
import { UserContext } from './context/userContext.js'
import PageNotFound from './pages/404page/PageNotFound.jsx'


function App() {
  const [user] = useContext(UserContext)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700)
    }

    handleResize() 
    window.addEventListener('resize', handleResize) 

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile) {
    return (
      <div className="mobile-message">
        Please open the website on a laptop or computer, or turn on desktop mode on your device.
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {
          user.token ? (
            <>
              <Route path="/" element={<Sodia />} />
              <Route path="/sodia" element={<Home />} />
              <Route path="/login" element={<Navigate to="/sodia" />} />
              <Route path="/register" element={<Navigate to="/sodia" />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/likedposts" element={<Home />} />
              <Route path="/messenger" element={<Messenger />} />
              <Route path="/404page" element={<PageNotFound />} />
              <Route path="*" element={<PageNotFound />} />  
            </>
            ) : (
            <>
              <Route path="/" element={<Sodia />} />
              <Route path="/sodia" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile/:username" element={<Navigate to="/login" />} />
              <Route path="/likedposts" element={<Navigate to="/login" />} />
              <Route path="/messenger" element={<Navigate to="/login" />} />
              <Route path="*" element={<Login />} />            
            </>
            )
        }
      </Routes>
    </Router>
  )
}

export default App