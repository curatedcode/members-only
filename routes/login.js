const express = require("express");
const router = express.Router();
const passport = require('passport');
const { checkNotAuth } = require("../passport-config");

router.get("/", checkNotAuth, (req, res, next) => {
  res.render("login", { title: "Login" });
});

router.post(
  "/",
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
);

module.exports = router