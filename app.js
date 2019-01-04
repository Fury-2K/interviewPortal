
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
autoIncrement = require('mongoose-auto-increment');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/quora_v2');
var db = mongoose.connection;
var connection = mongoose.createConnection("mongodb://localhost/quora_v2");
autoIncrement.initialize(connection);


var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

//custom helper compare for comparing 2 values in handlebars
const handlebars = exphbs.create({
  helpers: {
    extname: ".handlebars",
    layout: "layout",
    compare: function (lvalue, rvalue, options) {
      //console.log("a= " + lvalue + " b= " + rvalue);
      var operator = options.hash.operator || "==";
      var operators = {
        '==': function(l,r) { return l == r;},
        '===': function(l,r) { return l === r;}
      }
      var result = operators[operator](lvalue, rvalue);
      if (result) {
        return options.fn(this);
      }
      else {
        return options.inverse(this);
      }
    }
  }
});

// View Engine
//exphbs({ defaultLayout: 'layout' })
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars.engine);
//app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
//app.engine(exphbs('handlebars', {defaultlayout: 'layout'}));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.question = req.question || null;
  res.locals.answer = req.answer || null;
  res.locals.reply = req.reply || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});