const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
    trim: true,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,

    trim: true,

    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalid email and" + value);
      }
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("enter a strong password" + value);
      }
    },
  },
  age: {
    type: Number,
    required: true,
    min: 12,
  },

  phone: {
    type: Number,
  },
photo:{
    type: String,
    default: "https://www.w3schools.com/howto/img_avatar.png",
},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  address: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
    trim: true,
  },
});
UserSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id,
      emailId: user.emailId,
      role: user.role,
    },
    "DEV@TINDER&7481", // Replace this with process.env.JWT_SECRET in production
    {
      expiresIn: "7d",
    }
  );
  return token;
};

module.exports = mongoose.model("User", UserSchema);
