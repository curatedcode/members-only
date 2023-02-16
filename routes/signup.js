const bcrypt = require("bcryptjs");

const User = require("../models/user");

const express = require("express");
const { checkNotAuth } = require("../passport-config");
const router = express.Router();

router.get("/", checkNotAuth, (req, res, next) => {
  res.render("signup", { title: "Sign up" });
});

router.post("/", (req, res, next) => {
  if (
    /^[^\W_]+\w*(?:[.-]\w*)*[^\W_]+@[^\W_]+(?:[.-]?\w*[^\W_]+)*(?:\.[^\W_]{2,})$/i.test(
      req.body.email
    )
  ) {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
        full_name: {
          first: req.body.first_name,
          last: req.body.last_name,
        },
        membership: "standard",
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  }
});

module.exports = router;
