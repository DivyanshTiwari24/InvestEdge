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
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f9fafb",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
      }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Sign in to your account
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "1rem",
          }}
        >
          Or{" "}
          <Link
            to="/signup"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            create a new account
          </Link>
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "14px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "14px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "1rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Sign in
        </button>
      </form>
    </div>
  </div>
);
};

export default Login;