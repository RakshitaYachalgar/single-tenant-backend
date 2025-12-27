const express = require("express");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// CREATE
router.post("/", upload.single("photo"), async (req, res) => {
  const user = new User({
    ...req.body,
    photo: req.file?.filename
  });
  await user.save();
  res.json(user);
});

// READ
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// UPDATE
router.put("/:id", upload.single("photo"), async (req, res) => {
  const updated = {
    ...req.body
  };
  if (req.file) updated.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.params.id, updated, { new: true });
  res.json(user);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
