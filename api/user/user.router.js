const express = require("express");

const handlers = require("./user.handler");
const validator = require("./user.validator");
const authUser = require('../../middleware/authUser');
const validate = require("../../middleware/validate");

const router = express.Router();

router.post("/login", validate(validator.login), handlers.login);

router.post("/", handlers.createUser);

router.get("/list", authUser ,handlers.listUsers);

router.post("/getUsersById", authUser, validate(validator.userByIds), handlers.getUsersByIdsHandler);

router.post('/follow', authUser, validate(validator.followUser), handlers.followUser);

router.post('/unfollow', authUser, validate(validator.followUser), handlers.unfollowUser);

module.exports = router;
