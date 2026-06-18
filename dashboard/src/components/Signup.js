import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3002/signup", {
        email: email,
        password: password,
      });
      alert("Signup successful! Please login.");
      navigate("/login"); 
    } catch (err) {
      alert("Signup failed! User might already exist.");
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Sign Up</button>
        </form>
        <p style={styles.text}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f5f5f5" },
  card: { padding: "40px", background: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", width: "300px", textAlign: "center" },
  title: { marginBottom: "20px", color: "#444", fontWeight: "400" },
  form: { display: "flex", flexDirection: "column" },
  input: { padding: "10px", marginBottom: "15px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "1rem" },
  button: { padding: "10px", background: "#ff5722", color: "white", border: "none", borderRadius: "4px", fontSize: "1rem", cursor: "pointer" },
  text: { marginTop: "15px", fontSize: "0.8rem", color: "#666" },
  link: { color: "#ff5722", textDecoration: "none" }
};

export default Signup;