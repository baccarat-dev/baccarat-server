const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/users/signup", verifMailPassw, async (req, res) => {
  return res.status(400).json({ status: 400, msg: "Not allowed" });
  const email = req.body.email;
  const password = req.body.password;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ status: 400, msg: "Name already used" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      email,
      password: hashedPassword,
      role: "admin",
    };
    const dbRes = await User.insertMany([user]);
    res
      .status(201)
      .json({ status: 201, msg: "Welcome " + email.toUpperCase() });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: 500 });
  }
});

router.post("/users/login", verifMailPassw, async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
      const user = await User.findOne({ email });

      const accessToken = generateAccessToken({ email: email });
    return  res.status(200).json({
        status: 200,
        msg: "login successful",
        accessToken,
        user: user.toObject(),
      });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 401, msg: "User not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = generateAccessToken({ email: user.email });
      res.status(200).json({
        status: 200,
        msg: "login successful",
        accessToken,
        user: user.toObject(),
      });
    } else {
      return res.status(401).json({ status: 401, msg: "Password Incorrect" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ status: 500 });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

function verifMailPassw(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  return next();
  if (!email || !password) {
    return res.status(400).json({ status: 400, msg: "missing data" });
  }
  next();
}

module.exports = router;
