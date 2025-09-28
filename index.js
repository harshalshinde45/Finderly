import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/finderly");

// Define Schema & Model
const itemSchema = new mongoose.Schema({
  name: String,
  desc: String,
  location: String,
  status: String,
  images: [String],
  createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model("Item", itemSchema);

// Routes
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/items", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
