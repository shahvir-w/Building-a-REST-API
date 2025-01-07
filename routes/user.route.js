const express = require("express");
const router = express.Router();
const {
  getUsers,
  signupUser,
  loginUser,
  updateUser,
  deleteUser
} = require("../controllers/user.controller.js");

// get all users
router.get('/', getUsers);

// signup user
router.post('/signup', signupUser);

// login user
router.post('/login', loginUser);

// update a user
router.put('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

module.exports = router;
