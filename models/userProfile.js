const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfile = new Schema({
    name: String,
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: String
});

const UserProfile = mongoose.model("UserProfile", userProfile);

module.exports = UserProfile;
