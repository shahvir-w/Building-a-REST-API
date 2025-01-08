const mongoose = require("mongoose");
const UserScheme = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter username"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserScheme);
module.exports = User;
