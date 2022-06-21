const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let mongooseHidden = require('mongoose-hidden')()
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "A patient must have an email"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // hideJSON: true

  },

});
// userSchema.plugin(mongooseHidden)

const User = mongoose.model("User", userSchema);

module.exports = User;
