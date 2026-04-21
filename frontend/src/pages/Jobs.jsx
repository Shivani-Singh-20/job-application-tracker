import { useEffect, useState } from "react";
import axios from "axios";

const STATUS_OPTIONS = ["All", "Applied", "Interview", "Offer", "Rejected"];

const STATUS_COLORS = {
  Applied:   { bg: "#1e3a5f", color: "#93c5fd", dot: "#378ADD" },
  Interview: { bg: "#4a3000", color: "#fcd34d", dot: "#BA7517" },
  Offer:     { bg: "#1a3a0f", color: "#86efac", dot: "#639922" },
  Rejected:  { bg: "#3f1010", color: "#fca5a5", dot: "#E24B4A" },
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchJobs = async () => {
    const res = await axios.get("https://job-application-tracker-hilo.onrender.com", { headers });
    setJobs(res.data);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    await axios.delete(`https://job-application-tracker-hilo.onrender.com/jobs/${id}`, { headers });
    fetchJobs();
  };

  const handleEditSave = async (id) => {
    await axios.put(`https://job-application-tracker-hilo.onrender.com/jobs/${id}`, { status: editStatus }, { headers });
    setEditingId(null);
    fetchJobs();
  };

  const filtered = filter === "All" ? jobs : jobs.filter((j) => j.status === filter);

  const counts = {
    All:       jobs.length,
    Applied:   jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer:     jobs.filter((j) => j.status === "Offer").length,
    Rejected:  jobs.filter((j) => j.status === "Rejected").length,
  };

  return (
    <div className="page">
      <div className="header">
        <h1>Job Application Tracker</h1>
        <p>All your applications in one place</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-num">{counts.All}</div><div className="stat-lbl">Total</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"#93c5fd"}}>{counts.Applied}</div><div className="stat-lbl">Applied</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"#fcd34d"}}>{counts.Interview}</div><div className="stat-lbl">Interviews</div></div>
        <div className="stat-card"><div className="stat-num" style={{color:"#86efac"}}>{counts.Offer}</div><div className="stat-lbl">Offers</div></div>
      </div>

      <div className="filter-row">
        {STATUS_OPTIONS.map((s) => (
          <button key={s} className={`filter-pill ${filter === s ? "filter-active" : ""}`} onClick={() => setFilter(s)}>
            {s} <span className="filter-count">{counts[s]}</span>
          </button>
        ))}
      </div>

      <div className="jobs-list">
        {filtered.length === 0 && <div className="empty-state">No applications found.</div>}

        {filtered.map((job) => {
          const sc = STATUS_COLORS[job.status] || STATUS_COLORS["Applied"];
          const isEditing = editingId === job._id;
          return (
            <div className="job-card" key={job._id}>
              <div className="job-left">
                <div className="job-avatar">{job.company?.charAt(0).toUpperCase()}</div>
                <div className="job-info">
                  <div className="job-company">
                    {job.company}
                    {job.link && <a href={job.link} target="_blank" rel="noreferrer" style={{marginLeft:"8px",fontSize:"12px",color:"#378ADD",textDecoration:"none"}}>View posting ↗</a>}
                  </div>
                  <div className="job-role">{job.role}</div>
                  {job.date && <div className="job-date">Applied: {new Date(job.date).toLocaleDateString("en-IN")}</div>}
                </div>
              </div>

              <div className="job-right">
                {isEditing ? (
                  <div className="edit-row">
                    <select className="status-select" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                      {["Applied","Interview","Offer","Rejected"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button className="btn-save" onClick={() => handleEditSave(job._id)}>Save</button>
                    <button className="btn-cancel" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <div className="action-row">
                    <span className="status-badge" style={{background:sc.bg,color:sc.color}}>
                      <span className="status-dot" style={{background:sc.dot}}></span>
                      {job.status}
                    </span>
                    <button className="btn-edit" onClick={() => { setEditingId(job._id); setEditStatus(job.status); }}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Jobs;