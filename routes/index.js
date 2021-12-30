/* 모든 사용자를 찾은 후, sequelize.html을 렌더링할 때 결괏값인 users를 넣습니다. */

const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.render("sequelize", { users });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
