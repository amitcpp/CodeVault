import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Navbar from "../Navbar";
import Heatmap from "./HeatMap"; // or correct import path for your heatmap component
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "testuser1700" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (userId && token) {
        try {
          const res = await axios.get(
            `http://localhost:3002/userProfile/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserDetails(res.data);
        } catch (err) {
          console.error("Cannot fetch user details:", err);
        }
      } else {
        navigate("/login");
      }
    };
    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <UnderlineNav aria-label="Profile navigation" className="profile-nav">
        <UnderlineNav.Item icon={BookIcon} sx={{ color: "#fff" }}>
          Overview
        </UnderlineNav.Item>
        <UnderlineNav.Item
          icon={RepoIcon}
          onClick={() => navigate("/repo")}
          sx={{ color: "#fff" }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <div className="profile-header">
        <div className="user-profile-section">
          <div className="profile-image"></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <div className="profile-buttons">
            <button className="follow-btn">Follow</button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="follower">
            <p><strong>10 Followers</strong></p>
            <p><strong>3 Following</strong></p>
          </div>
        </div>

        <div className="heat-map-section">
          <Heatmap />
        </div>
      </div>
    </>
  );
};

export default Profile;
