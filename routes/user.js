const express = require("express");
const { authPass } = require("../controllers/auth");
const { body, param, validationResult } = require("express-validator");
const multer = require("multer");
const upload = multer({ dest: "public/files" });

const {
  getUsers,
  updateUsers,
} = require("../controllers/users");
const router = express.Router();

/* --------------------------------- Routes --------------------------------- */

router.get("/all", getUsers);
router.put("/update/:id", upload.single("image"), authPass, updateUsers);


module.exports = router;
