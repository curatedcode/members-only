const router = require('express').Router()
const User = require('../models/user');
const { checkAuth } = require('../passport-config');

router.get('/', checkAuth, (req, res, next)=>{
  User.findById(req.session.passport.user).exec((err, user) => {
    if (err) {
      return next(err);
    }
    res.render('upgrade_membership', {
      title: 'Upgrade Membership',
      membership: user.membership
    })
  });
})

router.post('/', (req, res, next)=>{
  if (req.body.password !== 'superSecretAdmin123' && req.body.password !== 'iAmTrustWorthy123'){
    res.redirect('/upgrade_membership')
  }
  User.findById(req.session.passport.user).exec((err, user) => {
    if (err) {
      return next(err);
    }
    let updatedUser = {...user._doc}
    updatedUser.membership = req.body.password === 'superSecretAdmin123' ? 'admin' : 'premium'
    User.findByIdAndUpdate(user._id, updatedUser, {}, err => {
      if(err){
        return next(err)
      }
      res.redirect('/')
    })
  });
})

module.exports = router