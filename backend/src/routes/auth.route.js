const authController = require("../controllers/auth.controller");
const middlewareController = require("../controllers/middleware.controller");

const router = require("express").Router()

// REGISTER
router.post("/register", authController.registerUser);

// LOGIN
router.post("/login", authController.loginUser);

// REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);

// LOGOUT
router.post("/logout", middlewareController.verifyToken , authController.userLogout);

module.exports = router;

