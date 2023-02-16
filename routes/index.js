var express = require('express');
var router = express.Router();
const Message = require('../models/message')

/* GET home page. */
router.get('/', function(req, res, next) {
  Message.find()
    .exec((err, result)=>{
      if(err){
        return next(err)
      }
      res.render('index', {
        title: "Poster",
        messages: result,
        isLoggedIn: req.isAuthenticated(),
        user: req.user
      });
    })
});

module.exports = router;
