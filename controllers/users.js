const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const UserProfile = require("../models/userProfile");
const multer = require("multer");
const upload = multer({ dest: "public/files" });


/* --------------------------- Fetch Bulk Details --------------------------- */

exports.getUsers = async (req, res) => {
  try {

    let user = await User.find();
    if (!user) {
      res.status(404).json({
        message: "No contact found",
      });
    }
    delete user.password;
    res.status(200).json({
      message: "Successfully created user ",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};


/* ----------------------------- Update Contact ----------------------------- */

exports.updateUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const newFields = {
      name,
      image: req.file.path,
    }
    let userProfile = await UserProfile.findOne({ user: id }).populate('user');
    if (!userProfile) {
      userProfile = await new UserProfile(newFields).populate('user');
    } else {
      userProfile.name = name;
      userProfile.image = req.file.path;
      userProfile.save();
    }


    res.status(201).json({
      message: "Successfully created User Profile ",
      userProfile
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
    });
  }
};
