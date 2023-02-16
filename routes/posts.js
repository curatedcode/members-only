const router = require("express").Router();
const Message = require("../models/message");
const { checkAuth } = require("../passport-config");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

router.get("/", checkAuth, (req, res, next) => {
  res.render("post_form", {
    title: "Create Post",
    errors: null,
  });
});

router.post("/", [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must not be empty"),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Body must not be empty"),

  (req, res, next) => {
    console.log(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render({
        title: "Create Post",
        errors: errors.array(),
      });
    }
    User.findById(req.session.passport.user).exec((err, result) => {
      if (err) {
        return next(err);
      }
      new Message({
        title: req.body.title,
        text: req.body.text,
        createdBy: result.name,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
]);

module.exports = router;
