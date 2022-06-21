const express = require("express");
const router = express.Router();
const { userRegister, login, getToken } = require("../controllers/auth");
const { body, validationResult } = require("express-validator");

/* --------------------------------- Routes --------------------------------- */
router.post(
  "/register",
  // username must be an email
  body("email").isEmail().withMessage('Please Enter Valid Email'),
  // password must be at least 5 chars long
  body("password").isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
  userRegister
);
router.post(
  "/login", // username must be an email
  body("email").isEmail(),
  login
);
router.get("/getJWT/:id", getToken);

module.exports = router;
