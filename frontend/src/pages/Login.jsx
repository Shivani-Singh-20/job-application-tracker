import { useState } from "react";
import axios from "axios";

function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("https://job-application-tracker-hilo.onrender.com/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Job Application Tracker</h1>
        <p>Sign in to your account</p>
      </div>

      <div className="form-card">
        <h2 className="card-title">Welcome back</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <hr className="divider" />

          <button type="submit" className="submit-btn">Sign in</button>

          <p className="login-link">
            Don't have an account?{" "}
            <a href="#" onClick={() => onRegister()}>Register</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;