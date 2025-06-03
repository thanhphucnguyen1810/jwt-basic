const middlewareController = require("../controllers/middleware.controller");
const userController = require("../controllers/user.controller");

const router = require("express").Router();

// GET ALL USERS
router.get("/", middlewareController.verifyToken, userController.getAllUsers);

// DELETE USER
router.delete("/:id", middlewareController.verifyTokenAndAdminAuth, userController.deleteUser);


module.exports = router;
