const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

const { connectDB } = require("./db/mongoConnect");
const { configRoutes } = require("./routes/configRoutes");

const app = express();

// allow requests from any domain
app.use(cors());
// static folder
app.use(express.static(path.join(__dirname, "public")));
// parse json body
app.use(express.json());

// wait for the database before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err: "Database connection failed", msg: err.message });
  }
});

configRoutes(app);

const server = http.createServer(app);
// process.env.PORT is used when deploying to Vercel / Render
const port = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  server.listen(port);
  console.log("http://localhost:" + port);
}

module.exports = app;
