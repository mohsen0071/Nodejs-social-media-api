const express = require("express");

const router = new express.Router();
const User = require("../models/user");

const authUser = require("../middleware/authUser");

router.post("/createUser", async (req, res) => {
  const { username, email } = req.body;

  const user = new User(req.body);

  try {
    const foundUsername = await User.findOne({ username });

    if (foundUsername) {
      return res
        .status(400)
        .send({ success: true, message: "This username is already taken" });
    }

    const foundEmail = await User.findOne({ email });

    if (foundEmail) {
      return res
        .status(400)
        .send({ success: true, message: "This email is already taken" });
    }

    await user.save();

    res.send({ user: user, success: true });
  } catch (err) {
    res.status(400).send({ success: true, message: err.message });
  }
});

router.get("/users", authUser, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    if (!user) {
      return res
        .status(400)
        .send({
          success: true,
          message: "No user found with these credentails",
        });
    }

    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
});

module.exports = router;
