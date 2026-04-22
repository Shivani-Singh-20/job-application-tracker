
// 1. Import packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 2. Import models
const User = require("./models/User");

// 3. Create express app
const app = express();

// 4. Middlewares
app.use(cors({
  origin: "*",
  credentials: false
}));
app.use(express.json());

// 5. Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ─────────────────────────────────────────
// AUTH MIDDLEWARE (protects routes)
// ─────────────────────────────────────────
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ─────────────────────────────────────────
// REGISTER ROUTE (now hashes password)
// ─────────────────────────────────────────
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // hash the password before saving
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────
// LOGIN ROUTE
// ─────────────────────────────────────────
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, name: user.name });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────
// JOB MODEL
// ─────────────────────────────────────────
const jobSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true },
  role:    { type: String, required: true },
  status:  { type: String, default: "Applied" },
  date:    { type: String },
  link:    {type: String},
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);

// ─────────────────────────────────────────
// JOB ROUTES (all protected)
// ─────────────────────────────────────────

// ADD a job
app.post("/add-job", protect, async (req, res) => {
  try {
    const { company, role, status, date,link } = req.body;
    const job = new Job({ userId: req.userId, company, role, status, date, link });
    await job.save();
    res.status(201).json({ message: "Job added", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all jobs (only this user's jobs)
app.get("/jobs", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a job
app.delete("/jobs/:id", protect, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE job status
app.put("/jobs/:id", protect, async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// 8. Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});