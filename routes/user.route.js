const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  authenticateToken
} = require("../controllers/user.controller.js");


// signup user
router.post('/signup', signupUser);

// login user
router.post('/login', loginUser);

// get user profile
router.get('/:id', authenticateToken, getUser);

// update a user
router.put('/:id', authenticateToken, updateUser);

// delete a user
router.delete('/:id', authenticateToken, deleteUser);

module.exports = router;
