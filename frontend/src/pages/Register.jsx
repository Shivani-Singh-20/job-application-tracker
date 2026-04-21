import { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    await axios.post("http://localhost:5000/register", { name, email, password });
    setSuccess(true);
    setTimeout(() => onRegister(), 1500); // ← go to login after 1.5 seconds
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Job Application Tracker</h1>
        <p>Create your account to get started</p>
      </div>

      <div className="form-card">
        <h2 className="card-title">Create account</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full name</label>
            <input type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label>Email address</label>
            <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="field">
            <label>Confirm password</label>
            <input type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <hr className="divider" />

          <button type="submit" className="submit-btn">Create account</button>

          {success && <div className="success-msg">Account created! Taking you to login...</div>}

          <p className="login-link">
            Already have an account?{" "}
            <a href="#" onClick={() => onRegister()}>Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;