import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3002";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/login`, {

        username: email, 
        password: password,
      });
      
      localStorage.setItem("token", res.data.token);
      
      // Instantly redirect to the Dashboard
      navigate("/"); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || "Login failed! Please check your credentials.";
      alert(errorMessage);
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ padding: "40px", background: "white", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)", textAlign: "center", width: "300px" }}>
        <h2 style={{ marginBottom: "20px", color: "#444", fontWeight: "400" }}>Login to Dashboard</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem" }} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem" }} 
          />
          <button 
            type="submit" 
            style={{ padding: "10px", background: "#4184f3", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" }}
          >
            Login
          </button>
        </form>
        <p style={{ marginTop: "20px", fontSize: "0.8rem", color: "#666" }}>
          No account? <Link to="/signup" style={{ color: "#4184f3", textDecoration: "none" }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;