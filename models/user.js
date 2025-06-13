const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const MAX_LOGIN_ATTEMPT = 15;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password cannot contain the word password");
      }
    },
  },
  followers: {
    type: Array,
    default: []
  },
  followings: {
    type: Array,
    default: []
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  login_attempt: {
    type: Number,
    default: 0,
  }
});

userSchema.virtual('userPosts', {
  ref: 'UserPost',
  localField: '_id',
  foreignField: 'userId'
})

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "havij");

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};


userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    // 404 or 401, your choice
    throw new ApiError(
      httpStatus.status.NOT_FOUND,
      'Email is not registered yet'
    );
  }

  if (user.login_attempt && user.login_attempt >= MAX_LOGIN_ATTEMPT) {
    // 400, 403, or 429 depending on your flow
    throw new ApiError(
      httpStatus.status.BAD_REQUEST,
      'Max login attempt reached.'
    );
  }

  // Must await bcrypt.compare
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // Increment login attempts
    user.login_attempt = (user.login_attempt || 0) + 1;
    await user.save(); // Make sure you await, *before* throwing
    throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Invalid credentials');
  }

  // Successful login -> reset login_attempt
  user.login_attempt = 0;
  await user.save();

  return user;
};


const User = mongoose.model("User", userSchema);

module.exports = User;


