var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const User = require("../models/user");
const { checkAuth } = require("../passport-config");

router.get("/", checkAuth, function (req, res, next) {
  Message.find()
    .sort([['createdAt', 'descending']])
    .exec((err, messages) => {
    if (err) {
      return next(err);
    }
    req.isAuthenticated()
      ? User.findById(req.session.passport.user).exec((err, user) => {
          if (err) {
            return next(err);
          }
          res.render("index", {
            title: "Poster",
            messages: messages,
            isLoggedIn: req.isAuthenticated(),
            user: {
              membership: user.membership,
              name: user.name,
            },
          });
        })
      : res.render("index", {
          title: "Poster",
          messages: messages,
          isLoggedIn: req.isAuthenticated(),
        });
  });
});

module.exports = router;
