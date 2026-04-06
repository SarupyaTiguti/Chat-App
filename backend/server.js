const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ CONNECT MONGODB (replace password)
mongoose.connect("mongodb://sarupyatiguti907:test1234@ac-tdeygll-shard-00-00.ev6qyyw.mongodb.net:27017,ac-tdeygll-shard-00-01.ev6qyyw.mongodb.net:27017,ac-tdeygll-shard-00-02.ev6qyyw.mongodb.net:27017/chatapp?ssl=true&replicaSet=atlas-e2u857-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const MessageSchema = new mongoose.Schema({
  content: String,
  timestamp: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedForEveryone: { type: Boolean, default: false },
  pinned: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", MessageSchema);

// ✅ SEND MESSAGE
app.post("/send", async (req, res) => {
  if (!req.body.content) return res.status(400).send("Empty message");

  const msg = await Message.create({
    content: req.body.content,
  });

  res.json(msg);
});

// ✅ GET MESSAGES
app.get("/messages", async (req, res) => {
  const msgs = await Message.find().sort({ timestamp: 1 });
  res.json(msgs);
});

// ✅ DELETE FOR ME
app.put("/delete/me/:id", async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { deleted: true });
  res.send("Deleted for me");
});

// ✅ DELETE FOR EVERYONE
app.put("/delete/all/:id", async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, {
    deletedForEveryone: true,
  });
  res.send("Deleted for everyone");
});

// ✅ PIN MESSAGE
app.put("/pin/:id", async (req, res) => {
  await Message.findByIdAndUpdate(req.params.id, { pinned: true });
  res.send("Pinned");
});

app.listen(5000, () => console.log("Server running on 5000"));