import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import styles from './Dashboard.module.css';

function Dashboard() {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogout = async () => {
    await api.post("/logout");
    navigate("/login");
  };

  return (
  <div className={styles.dashboardPage}>
    <div className={styles.card}>
      <h2 className={styles.title}>Dashboard</h2>
      <p className={styles.message}>Welcome! {msg}</p>
      <div className={styles.buttons}>
        <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
        <Link to="/verify-account" className={styles.link}>Verify Account</Link>
      </div>
    </div>
  </div>
);

}

export default Dashboard;
