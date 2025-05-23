const authController = require("../controllers/auth.controller");

const router = require("express").Router()

// REGISTER
router.post("/register", authController.registerUser);

// LOGIN
router.post("/login", authController.loginUser);

module.exports = router;
