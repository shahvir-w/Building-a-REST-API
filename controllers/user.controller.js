require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signupUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const NewUser = await user.save();
    res.status(201).json(NewUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res.status(400).send("Cannot find user");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (isMatch) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(
        { id: user._id, username: user.username },
        process.env.REFRESH_TOKEN_SECRET
      );
      res.status(200).json({
        response: "success",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      const refreshTokensCollection =
        mongoose.connection.db.collection("refreshTokens");
      await refreshTokensCollection.insertOne({
        token: refreshToken,
        createdAt: new Date(),
      });
    } else {
      res.status(200).send("Unsuccessful");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      return res.status(400).json({ message: "Token required" });
    }

    const refreshTokensCollection =
      mongoose.connection.db.collection("refreshTokens");
    const tokenExists = await refreshTokensCollection.findOne({
      token: req.body.token,
    });
    if (!tokenExists) {
      return res.status(404).json({ message: "Token not found" });
    }

    await refreshTokensCollection.deleteOne({ token: refreshToken });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  const refreshTokensCollection =
    mongoose.connection.db.collection("refreshTokens");
  const tokenExists = await refreshTokensCollection.findOne({
    token: refreshToken,
  });
  if (!tokenExists) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({
      id: user._id,
      username: user.username,
    });
    res.json({ accessToken: accessToken });
  });
};

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  createToken,
};
