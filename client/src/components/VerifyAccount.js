import React, { useState } from "react";
import api from "../api";
import styles from './VerifyAccount.module.css'; 

function VerifyAccount() {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const sendOtp = async () => {
    const res = await api.post("/send-verify-otp");
    setMsg(res.data.message);
  };

  const verifyOtp = async e => {
    e.preventDefault();
    const res = await api.post("/verify-account", { otp });
    setMsg(res.data.message);
  };

  return (
  <div className={styles.verifyPage}>
    <div className={styles.card}>
      <h2 className={styles.title}>Verify Account</h2>
      <button className={styles.sendOtpButton} onClick={sendOtp}>Send OTP</button>
      <form onSubmit={verifyOtp} className={styles.form}>
        <input
          className={styles.input}
          placeholder="Enter OTP"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          required
        />
        <button type="submit" className={styles.button}>Verify</button>
      </form>
      <p className={styles.message}>{msg}</p>
    </div>
  </div>
);

}

export default VerifyAccount;
