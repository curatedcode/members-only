var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_DB_URL)
const db = mongoose.connection
db.on('error', console.error.bind(console, "mongo connection error"))
mongoose.set("strictQuery", false)

var indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup')
const upgradeRouter = require('./routes/upgradeMembership')
const postRouter = require('./routes/posts')

var app = module.exports = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport');

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const initializePassport = require('./passport-config').initialize;
initializePassport(passport)

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/upgrade_membership', upgradeRouter)
app.use('/create_post', postRouter)

app.use('/logout', (req, res, next) => {
  req.logOut(err => {
    if(err){
      return next(err)
    }
    res.redirect('/')
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: "Error"});
});

module.exports = app;
