const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

/* -------------------------- Registering the user -------------------------- */
exports.userRegister = async (req, res, next) => {
  try {
    //Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({
        status: "error",
        message: "Email already exists",
      });
    } else {
      //Hashing Algo
      bcrypt.hash(req.body.password, 10, async function (err, hashedPassword) {
        if (err) {
          res.status(400).json({
            status: "error",
            message: "Failed",
          });
        }

        let user = new User({
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name
        });

        await user.save();
      });

      res.status(200).json({
        status: "success",
        message: "Successfully registered User ",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Failure",
      message: error,
    });
  }
};

/* --------------------------------- Logging -------------------------------- */

exports.login = async (req, res, next) => {
  //Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password)
  //Finding the Email And MAtching PassWord
  User.findOne({ email: email }).then(async (user) => {
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, async (err, result) => {
        console.log(user.password, password);
        if (err) {
          return res.status(400).json({
            status: "error",
            message: "Some error occured",
          });
        }
        if (result) {
          var token = jwt.sign(
            { id: user._id, isPatient: true },
            process.env.JWT_SECRET,
            {
              expiresIn: "2d",
            }
          );

          res.status(200).json({
            status: "success",
            message: "Logged In successfully",
            user: true,
            token,
          });
        } else {
          res.status(400).json({
            status: "error",
            message: "Credentials Not Correct",
          });
        }
      });
    }
  });
};

/* ----------------------- Authentication Middle Ware ----------------------- */
exports.authPass = async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // console.log("Inside If of auth Pass");
    // console.log(req.headers.authorization);
    // console.log(req.headers.authorization.startsWith("Bearer"));

    token = req.headers.authorization.split(" ")[1];
    // console.log(token);
  }

  if (!token || token === null || token == undefined) {
    return res.status(200).json({
      message: "You aren't Logged In",
    });
  }

  // 2) Verification token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log("This is decoded", decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    const currentDoctor = await Doctor.findById(decoded.id);
    if (currentDoctor) {
      req.user = currentDoctor;
      res.locals.user = currentDoctor;
      return next();
    } else {
      return res.status(404).json({
        message: "You aren't Logged In",
      });
    }
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  // console.log("This is req.user from middleware", req.user);
  res.locals.user = currentUser;
  console.log("Successfully Passed Middleware");
  next();
};

/* ------------------------------ To Fetch Token ----------------------------- */
exports.getToken = (req, res) => {
  const { id } = req.body;

  //Sending token after generating with User Id
  var token = jwt.sign({ id: id, isPatient: true }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
  res.status(200).json({
    status: "success",
    token,
  });
};
