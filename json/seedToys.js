const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });
const toys = require("./toys.json");
const { ToyModel } = require("../models/toyModel");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_DB);
  await ToyModel.deleteMany({});
  await ToyModel.insertMany(toys);
  const count = await ToyModel.countDocuments({});
  console.log(count + " toys inserted");
  mongoose.disconnect();
};

seed();
