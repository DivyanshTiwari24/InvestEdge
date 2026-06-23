import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3002"
  : "https://invest-edge-iota.vercel.app";

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
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "40px",
          background: "var(--bg-secondary)",
          borderRadius: "8px",
          boxShadow: "0 8px 24px var(--shadow-color)",
          border: "1px solid var(--border-color)",
          textAlign: "center"
        }}
      >
        {/* Brand Emblem */}
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "25px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(135deg, #f05022, #ff7640)", marginRight: "10px" }} />
          <span style={{ fontSize: "1.6rem", fontWeight: "700", letterSpacing: "1px", color: "var(--text-title)" }}>KITE</span>
        </div>

        <h2 style={{ fontSize: "1.3rem", fontWeight: "400", color: "var(--text-primary)", marginBottom: "30px" }}>
          Login to Kite
        </h2>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "left" }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "var(--search-bg)",
                color: "var(--text-primary)",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid var(--border-color)",
                borderRadius: "4px",
                fontSize: "0.95rem",
                outline: "none",
                boxSizing: "border-box",
                backgroundColor: "var(--search-bg)",
                color: "var(--text-primary)",
                transition: "border-color 0.2s"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: "13px",
              background: "#4184f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: "30px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#f05022",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;