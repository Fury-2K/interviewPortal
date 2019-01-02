
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var Reply = require('../models/reply');
var tempQid;
var tempQuestion;

//index
router.get('/index', function (req, res) {
	res.render('index');
	// Question.printQuestion(req, res);
});

// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});

//home
router.get('/home', ensureAuthenticated, function(req, res) {
	Question.printMultipleQuestions(req, res);
});

// New Question
router.post('/ask', function (req, res) {
	var quesContent = req.body.quesContent;

	// Validation
	req.checkBody('quesContent', 'Question is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('ask', {
			errors: errors
		});
	}
	else {
		var newQuestion = new Question({
			authorid: req.user.uid,
			content: quesContent
		});
		Question.createQuestion(newQuestion, function (err, question) {
			if (err) throw err;
			console.log(question);
		});
		req.flash('success_msg', 'Your question posted successfully');
		res.redirect('/users/home');
	}
});

// New Answer
router.post('/answer', function (req, res) {
	var ansContent = req.body.ansContent;

	// Validation
	req.checkBody('ansContent', 'Answer is required').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		res.render('answer', {
			errors: errors
		});
	}
	else {
		var newAnswer = new Answer({
			authorid: req.user.uid,
			qid: temp,
			answer: ansContent
		});
		Answer.createAnswer(newAnswer, function (err, answer) {
			if (err) throw err;
			console.log(answer);
		});
		req.flash('success_msg', 'Your answer posted successfully');
		res.redirect('/users/home');
	}
});

// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({
			username: {
				"$regex": "^" + username + "\\b", "$options": "i"
			}
		}, function (err, user) {
			User.findOne({
				email: {
					"$regex": "^" + email + "\\b", "$options": "i"
				}
			}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				
				else {
					var newUser = new User({
						name: name,
						email: email,
						username: username,
						password: password,
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
					req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/users/home', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/users/home');
	});

router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});


function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg','Please login first');
		res.redirect('/users/login');
	}
}

router.get('/answer', ensureAuthenticated, function(req, res) {
	// Question.printQuestion(req, res, function(res) {
	// 	temp = res.qid;
	// 	//console.log("ANS-"+temp);
	// 	console.log("1");
	// 	Question.getQuestionByQid(req, res, temp, function(res) {
	// 		tempQuestion = res;
	// 		//console.log("questiondata-"+tempQuestion);
	// 		console.log("2");
	// 	});
	// 	console.log("3");
	// 	//response1.render('answer', {tempQuestion});
	// 	// Answer.printAnswer(req, res, response.qid);
	// });
	// console.log("4");
	// //res.render('answer', {items: tempQuestion});


	Question.printQuestion(req, res, function(item) {
		tempQid = item.qid;
		tempQuestion = item.content;
		console.log("xx"+tempQid+tempQuestion);
		res.render('answer', {tempQuestion: tempQuestion});
	});
});

router.get('/ask', ensureAuthenticated, function(req, res) {
	res.render('ask');
});

// router.get('/answer', ensureAuthenticated, function(req, res) {
// 	res.render('answer');
// });

module.exports = router;