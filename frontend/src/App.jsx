import { useState } from 'react';
import Register from "./pages/Register";
import AddJob from "./pages/AddJob";
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import './App.css';

function App() {
  const [page, setPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const name = localStorage.getItem("name");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage("jobs");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setPage("login");
  };

  if (!isLoggedIn) {
    return (
      <div>
        <div className="nav">
          <button className={`nav-btn ${page === "login" ? "nav-active" : ""}`} onClick={() => setPage("login")}>Login</button>
          <button className={`nav-btn ${page === "register" ? "nav-active" : ""}`} onClick={() => setPage("register")}>Register</button>
        </div>
        {page === "login" && <Login onLogin={handleLogin} onRegister={() => setPage("register")} />}
        {page === "register" && <Register onRegister={() => setPage("login")} />}
      </div>
    );
  }

  return (
    <div>
      <div className="nav">
        <span className="nav-greeting">Hi, {name}!</span>
        <button className={`nav-btn ${page === "jobs" ? "nav-active" : ""}`} onClick={() => setPage("jobs")}>My Applications</button>
        <button className={`nav-btn ${page === "add" ? "nav-active" : ""}`} onClick={() => setPage("add")}>+ Add Job</button>
        <button className="nav-btn nav-logout" onClick={handleLogout}>Logout</button>
      </div>
      {page === "jobs" && <Jobs />}
      {page === "add" && <AddJob />}
    </div>
  );
}

export default App;