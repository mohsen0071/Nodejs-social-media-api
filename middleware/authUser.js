const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const authUser = async (req, res, next) => {
    console.log(httpStatus.status.UNAUTHORIZED)
  try {
    const token = req?.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("JWT auth token is not given");
      throw new ApiError(
        httpStatus.status.UNAUTHORIZED,
        "Authentication token is missing"
      );
    }

    const { _id } = jwt.verify(token, "havij");

    const user = _id ? await User.findById({ _id }) : null;

    if (!user?._id) {
      console.log("Invalid token");
      throw new ApiError(httpStatus.status.UNAUTHORIZED, "Invalid token");
    }

    req.user = user;
    next();
  } catch (err) {
    console.log(err.message);
    next(
      new ApiError(httpStatus.status.UNAUTHORIZED, err?.message || "Invalid token")
    );
  }
};

module.exports = authUser;
