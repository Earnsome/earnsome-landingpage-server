import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ---------------- MongoDB ---------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

/* ---------------- Schema ---------------- */

const waitlistSchema = new mongoose.Schema({
  name: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

/* ---------------- Routes ---------------- */

// Add to waitlist
app.post("/api/waitlist", async (req, res) => {
  try {
    const { name, email } = req.body;

    const existing = await Waitlist.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Already joined waitlist" });
    }

    const user = new Waitlist({ name, email });
    await user.save();

    res.json({ message: "Added to waitlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all (optional admin use)
app.get("/api/waitlist", async (req, res) => {
  const users = await Waitlist.find();
  res.json(users);
});


app.get("/", async (req, res) => {
    let acknowledgement2= '<h1>Welcome to the Earnsome LP Server! </h1> <h2>Try Route: /api/waitlist to get users registered on waitlist</h2>';
  res.send(acknowledgement2);
});

/* ---------------- Start Server ---------------- */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});