const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const morgan = require("morgan");

let server = require("http").Server(app);
const connectDB = require("./config/db");

dotenv.config({ path: "./config/env/config.env" });
connectDB();

/* ------------------------------- MiddleWares ------------------------------ */

// app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("dev"));
/* -------------------------------------------------------------------------- */

/* --------------------------------- Routes --------------------------------- */

app.use("/", require("./routes/auth"));
app.use("/user", require("./routes/user"));

/* -------------------------------------------------------------------------- */

/* ------------------------------ Server Setup ------------------------------ */
const PORT = process.env.PORT || 8000;

var Server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});
/* -------------------------------------------------------------------------- */
