const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/user");

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    User.findOne({ email: email }).exec((err, result) => {
      if (err) {
        return done(err);
      }
      if (!result) {
        return done(null, false, { message: "Incorrect Email" });
      }
      if (bcrypt.compare(password, result.password)) {
        return done(null, result);
      } else {
        return done(null, false, { message: "Incorrect Password" });
      }
    });
  };

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser((id, done) => {
    return done(null, User.findById(id));
  });
}

function checkNotAuth(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('back')    
  }
  return next()
}

function checkAuth(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  return res.redirect('/login')
}

module.exports = {
  initialize,
  checkAuth,
  checkNotAuth
};
