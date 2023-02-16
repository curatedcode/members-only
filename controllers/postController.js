const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.post_create_get = (req, res, next) => {
  res.render("post_form", {
    title: "Create Post",
    errors: null,
  });
};

exports.post_create_post = [
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
];

exports.post_delete_get = (req, res, next) => {
  Message.findById(req.params.message_id)
    .exec((err, result) => {
      if(err){
        return next(err)
      }
      return res.render('post_form_delete', {
        title: "Delete Post",
        message: result
      })
    })
}

exports.post_delete_post = (req, res, next) => {
  Message.findByIdAndRemove(req.params.message_id)
    .exec( err => {
      if(err){
        return next(err)
      }
      return res.redirect('/')
    })
};
