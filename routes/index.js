const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Toys API is running, see the documentation in README.md" });
});

module.exports = router;
