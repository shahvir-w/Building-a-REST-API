require("dotenv").config();

const express = require("express");
const app = express();
const productRoute = require("./routes/product.route.js");
const userRoute = require("./routes/user.route.js");
const cartRoute = require("./routes/cart.route.js");
const {authenticateToken} = require("./helpers/auth.js");

const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("connected to database");
    app.listen(3000, () => console.log("server is running"));
  })
  .catch(() => {
    console.log("connection failed");
  });

//middleware
app.use(express.json());
app.use((req, res, next) => {
  if (req.path === "/api/users/login" || req.path === "/api/users/signup") {
    return next();
  }
  authenticateToken(req, res, next);
});

//routes
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});
