const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const validate = require("../middleware/validate-middleware");
const authMiddleware = require("../middleware/auth-middleware");
const { loginSchema, signUpSchema } = require("../validators/auth-validator");


router.route("/").get(authcontrollers.home);
router.route("/signUp").post(validate(signUpSchema), authcontrollers.signUp);
router.route("/user").get(authMiddleware, authcontrollers.user);
router.route("/update/:id").put(authMiddleware, authcontrollers.updateUserById);
router.route("/login").post(authcontrollers.verifyOtp);
router.route("/logout").post(authMiddleware, authcontrollers.logout);
module.exports = router;