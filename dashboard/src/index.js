import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import axios from 'axios';
import Home from './components/Home'; 
import Login from './components/Login';
import Signup from './components/Signup';

// Global response interceptor for handling token expiration/failure (401/403)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/signup") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      {/* These standalone routes will NOT have the TopBar or Watchlist */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* The "/*" acts as a catch-all. If you aren't on login or signup, 
          it loads the Home component (which contains your TopBar and Dashboard) */}
      <Route path="/*" element={<Home />} />
    </Routes>
  </BrowserRouter>
);