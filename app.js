const express = require("express");
const path = require("path");
const http = require("http");
const cors = require("cors");

require("./db/mongoConnect");
const { configRoutes } = require("./routes/configRoutes");

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

configRoutes(app);

const server = http.createServer(app);
const port = process.env.PORT || 3001;
server.listen(port);

console.log("http://localhost:" + port);
