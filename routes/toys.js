const express = require("express");
const { ToyModel, validToy } = require("../models/toyModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

const PER_PAGE = 10;

const buildFilter = (query) => {
  const filter = {};

  if (query.s) {
    const searchExp = new RegExp(query.s, "i");
    filter.$or = [{ name: searchExp }, { info: searchExp }];
  }

  if (query.category) {
    filter.category = new RegExp("^" + query.category + "$", "i");
  }

  if (query.min || query.max) {
    filter.price = {};
    if (query.min) filter.price.$gte = Number(query.min);
    if (query.max) filter.price.$lte = Number(query.max);
  }

  return filter;
};

const buildSkip = (query) => {
  const page = Number(query.skip) || 0;
  return page * PER_PAGE;
};

const sendToys = async (req, res, extraFilter = {}) => {
  try {
    const filter = { ...buildFilter(req.query), ...extraFilter };
    const data = await ToyModel
      .find(filter)
      .limit(PER_PAGE)
      .skip(buildSkip(req.query))
      .sort({ _id: -1 });
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
};

router.get("/", async (req, res) => {
  sendToys(req, res);
});

router.get("/count", async (req, res) => {
  try {
    const data = await ToyModel.countDocuments({});
    res.json({ count: data });
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/search", async (req, res) => {
  sendToys(req, res);
});

router.get("/prices", async (req, res) => {
  sendToys(req, res);
});

router.get("/single/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.findOne({ _id: id });
    if (!data) {
      return res.status(404).json({ err: "Toy not found" });
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.get("/category/:catname", async (req, res) => {
  const catFilter = { category: new RegExp("^" + req.params.catname + "$", "i") };
  sendToys(req, res, catFilter);
});

router.post("/", auth, async (req, res) => {
  const validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const toy = new ToyModel(req.body);
    toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.put("/:id", auth, async (req, res) => {
  const validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const id = req.params.id;
    const data = await ToyModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
    if (data.matchedCount == 0) {
      return res.status(401).json({ err: "This toy does not belong to you, or it does not exist" });
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ToyModel.deleteOne({ _id: id, user_id: req.tokenData._id });
    if (data.deletedCount == 0) {
      return res.status(401).json({ err: "This toy does not belong to you, or it does not exist" });
    }
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err });
  }
});

module.exports = router;
