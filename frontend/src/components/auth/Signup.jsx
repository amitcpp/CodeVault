// src/components/auth/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authcontext";
import { PageHeader } from "@primer/react/experimental";
import { Box, Button } from "@primer/react";
import { Link } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Signup = () => {
  const { setCurrentUser } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://54.235.9.54:3002/signup", {// problem 
        username,
        email,
        password,
      });
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("token", res.data.token);
      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box-wrapper">
        <div className="login-logo-container">
          <img className="logo-login" src={logo} alt="GitHub logo" />
        </div>
        <div className="login-heading">
          <Box>
            <PageHeader>
              <PageHeader.TitleArea>
                <PageHeader.Title>Sign Up</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>
        <div className="login-box">
          <label className="label">Username</label>
          <input
            className="input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="label">Email address</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="login-button"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing up..." : "Signup"}
          </Button>
        </div>
        <div className="pass-box">
          Already have an account? <Link to="/auth">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
