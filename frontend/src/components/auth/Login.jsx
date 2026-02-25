// src/components/auth/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authcontext";
import { PageHeader } from "@primer/react/experimental";
import { Box, Button } from "@primer/react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://18.233.89.91/login", {
        email,
        password,
      });

      // ✅ Save auth data
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("token", res.data.token);

      setCurrentUser(res.data.userId);

      // ✅ React navigation (better than reload)
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Login failed");
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
                <PageHeader.Title>Sign In</PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
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
            disabled={loading}
            type="submit"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="pass-box">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;