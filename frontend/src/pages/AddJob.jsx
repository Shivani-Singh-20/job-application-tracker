import { useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = ["Applied", "Interview", "Offer", "Rejected"];

function AddJob() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [link, setLink] = useState("");
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company || !role || !status) {
      alert("Please fill in all fields and select a status.");
      return;
    }
    await axios.post(
      "http://localhost:5000/add-job",
      { company, role, status, date, link },
      { headers }
    );
    setCompany("");
    setRole("");
    setStatus("");
    setDate(new Date().toISOString().split("T")[0]);
    setLink("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2500);
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Job Application Tracker</h1>
        <p>Track every application in one place</p>
      </div>

      <div className="form-card">
        <h2 className="card-title">Add new application</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Company name</label>
            <input
              type="text"
              placeholder="e.g. Google, Infosys, TCS..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Role / Position</label>
            <input
              type="text"
              placeholder="e.g. Frontend Developer..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Job posting link <span style={{ color: "#6b7280", fontWeight: 400 }}>(optional)</span></label>
            <input
              type="url"
              placeholder="e.g. https://naukri.com/job-xyz..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Date applied</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Application status</label>
            <div className="status-pills">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`pill pill-${s.toLowerCase()} ${status === s ? "active" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <hr className="divider" />

          <button type="submit" className="submit-btn">
            + Add application
          </button>

          {success && (
            <div className="success-msg">Application added successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddJob;