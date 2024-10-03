const express = require("express");
const userController = require("../controllers/user.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:userId", userController.getUserById);
router.post("/registerUser", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/updateProfile", authMiddleware, userController.updateProfile);
router.get("/confirm/:token", userController.confirmToken);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword/:id/:token", userController.resetPassword);
router.post("/makeIndividualSchedules", userController.makeIndividualEvents);
router.post("/getIndividualSchedules", userController.getIndividualSchedules);
router.post("/add-employee", userController.addEmployees);
router.post(
  "/getOrganizationEmployees",
  userController.getOrganizationEmployees
);

router.post("/getUserData", authMiddleware, userController.getUserData);

module.exports = router;
