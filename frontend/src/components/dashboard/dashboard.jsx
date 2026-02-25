import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Protect route (VERY IMPORTANT)
  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    fetchRepositories(userId);
    fetchSuggestedRepositories();
  }, []);

  // ✅ Fetch user repos
  const fetchRepositories = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://18.233.89.91/repo/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.repositories) {
        setRepositories(data.repositories);
        setSearchResults(data.repositories);
      } else {
        setRepositories([]);
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Error fetching user repositories:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all repos (suggestions)
  const fetchSuggestedRepositories = async () => {
    try {
      const res = await fetch(`http://34.204.44.131/repo/all`);
      const data = await res.json();
      setSuggestedRepositories(data || []);
    } catch (err) {
      console.error("Error fetching suggested repos:", err);
    }
  };

  // ✅ Search filter
  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <>
      <Navbar />

      <section id="dashboard">
        {/* LEFT SIDE */}
        <aside>
          <h3>Suggested Repositories</h3>

          {suggestedRepositories.length === 0 ? (
            <p>No repositories available</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <div key={repo._id} className="repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </aside>

        {/* MAIN */}
        <main>
          <h2>Your Repositories</h2>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchResults.length === 0 ? (
            <p>No repositories found</p>
          ) : (
            searchResults.map((repo) => (
              <div key={repo._id} className="repo-card">
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
              </div>
            ))
          )}
        </main>

        {/* RIGHT SIDE */}
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Conference - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Dec 10</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;