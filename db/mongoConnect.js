const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

let connection = null;

// the connection is cached so a serverless function reuses it between calls
const connectDB = () => {
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_DB).then(() => {
      console.log("mongo connect toys");
    });
  }
  return connection;
};

connectDB().catch(err => console.log(err));

module.exports = { connectDB };
