const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  authenticateToken,
  createToken
} = require("../controllers/user.controller.js");


// signup user
router.post('/signup', signupUser);

// login user
router.post('/login', loginUser);

// logout user
router.delete('/logout', logoutUser);

// get user profile
router.get('/', getUser);

// update a user
router.put('/:id', updateUser);

// delete a user
router.delete('/:id', deleteUser);

// create a new accessToken
router.post('/token', createToken)

module.exports = router;
