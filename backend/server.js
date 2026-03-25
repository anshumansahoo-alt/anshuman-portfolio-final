// server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Open CORS — fine for a portfolio site
app.use(cors());

app.use(express.json());

// ------------------- MongoDB Schemas -------------------

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  year: Number,
});
const Project = mongoose.model("Project", ProjectSchema);

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now },
});
const Contact = mongoose.model("Contact", ContactSchema);

// ------------------- Routes -------------------

app.get("/", (req, res) => {
  res.send("Portfolio backend running ✅");
});

app.get("/add-project", async (req, res) => {
  try {
    const project = new Project({ name: "Test Project", description: "This is a test", year: 2026 });
    await project.save();
    res.send("✅ Project saved to MongoDB!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error saving project");
  }
});

app.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ year: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error fetching projects");
  }
});

app.delete("/projects/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.send("✅ Project deleted!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error deleting project");
  }
});

app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).send("❌ All fields are required");
    }
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.send("✅ Contact message saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error saving contact message");
  }
});

// ------------------- Connect & Start -------------------

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
