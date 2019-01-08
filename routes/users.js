
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Question = require('../models/question');
var Answer = require('../models/answer');
var Reply = require('../models/reply');
var tempAid;
var tempOpt;

//index
router.get('/index', function (req, res) {
	res.render('index', { layout: 'layout' });
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
router.get('/home', ensureAuthenticated, function (req, res) {
	res.render('home', { layout: 'layout' });
});

//topic1
router.get('/topic1', function (req, res) {
	var topic = 'C-Programming';
	Question.printQuestionsByTopic(req, res, 1, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '1';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic2
router.get('/topic2', function (req, res) {
	var topic = 'Data Structures';
	Question.printQuestionsByTopic(req, res, 2, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '2';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic3
router.get('/topic3', function (req, res) {
	var topic = '.NET';
	Question.printQuestionsByTopic(req, res, 3, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '3';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic4
router.get('/topic4', function (req, res) {
	var topic = 'Software Testing';
	Question.printQuestionsByTopic(req, res, 4, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '4';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic5
router.get('/topic5', function (req, res) {
	var topic = 'Networking';
	Question.printQuestionsByTopic(req, res, 5, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '5';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic6
router.get('/topic6', function (req, res) {
	var topic = 'Operating System (OS)';
	Question.printQuestionsByTopic(req, res, 6, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '6';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic7
router.get('/topic7', function (req, res) {
	var topic = 'Java';
	Question.printQuestionsByTopic(req, res, 7, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '7';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic8
router.get('/topic8', function (req, res) {
	var topic = 'Database Management (DBMS)';
	Question.printQuestionsByTopic(req, res, 8, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '8';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//topic9
router.get('/topic9', function (req, res) {
	var topic = 'UNIX';
	Question.printQuestionsByTopic(req, res, 9, function (item) {
		Answer.printMultipleAnswers(req, res, function (item1) {
			Reply.printReply(req, res, function(item2) {
				var tempTopicId = '9';
				res.render('topic', { layout: 'layout', items: item, ans: item1, topic: topic, topicID: tempTopicId, comm: item2});
			});
		});
	});
});

//add reply
router.post('/topic', function (req, res) {
	var comment = req.body.comment;
	tempAid = req.query.id;
	tempOpt = req.query.opt;
	console.log("xxxxxxxAID- " + tempAid + "opt- " + tempOpt);

	//Validations
	req.checkBody('comment', 'Comment Empty!!').notEmpty();

	var errors = req.validationErrors();

	if (errors) {
		//res.render('topic')
		console.log("ERROR!!- " + errors);
	}

	var newReply = new Reply({
		aid: tempAid,
		authorid: req.user.uid,
		authorName: req.user.name,
		content: comment
	});
	Reply.createReply(newReply, function (err, reply) {
		if (err) throw err;
		console.log(reply);
	});

	req.flash('success_msg', 'Your question posted successfully');

	if (tempOpt == "1") {
		res.redirect('/users/topic1');
	}
	else if (tempOpt == "2") {
		res.redirect('/users/topic2');
	}
	else if (tempOpt == "3") {
		res.redirect('/users/topic3');
	}
	else if (tempOpt == "4") {
		res.redirect('/users/topic4');
	}
	else if (tempOpt == "5") {
		res.redirect('/users/topic5');
	}
	else if (tempOpt == "6") {
		res.redirect('/users/topic6');
	}
	else if (tempOpt == "7") {
		res.redirect('/users/topic7');
	}
	else if (tempOpt == "8") {
		res.redirect('/users/topic8');
	}
	else if (tempOpt == "9") {
		res.redirect('/users/topic9');
	}
});

// New Question
router.post('/ask', function (req, res) {
	var quesContent = req.body.quesContent;
	var topicArray = [];
	if (req.body.c1) {
		topicArray.push(req.body.c1);
	}
	if (req.body.c2) {
		topicArray.push(req.body.c2);
	}
	if (req.body.c3) {
		topicArray.push(req.body.c3);
	}
	if (req.body.c4) {
		topicArray.push(req.body.c4);
	}
	if (req.body.c5) {
		topicArray.push(req.body.c5);
	}
	if (req.body.c6) {
		topicArray.push(req.body.c6);
	}
	if (req.body.c7) {
		topicArray.push(req.body.c7);
	}
	if (req.body.c8) {
		topicArray.push(req.body.c8);
	}
	if (req.body.c9) {
		topicArray.push(req.body.c9);
	}
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
			content: quesContent,
			topic: topicArray
		});
		Question.createQuestion(newQuestion, function (err, question) {
			if (err) throw err;
			console.log(question);
		});
		req.flash('success_msg', 'Your question posted successfully');
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
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'Please login first');
		res.redirect('/users/login');
	}
}

//increase upvotes
router.get('/upvote', ensureAuthenticated, function (req, res) {
	var tempAid = req.query.id;
	var opt = req.query.opt;
	Answer.upVote(req, res, tempAid, function (item) {
		if (opt == "1") {
			res.redirect('/users/topic1');
		}
		else if (opt == "2") {
			res.redirect('/users/topic2');
		}
		else if (opt == "3") {
			res.redirect('/users/topic3');
		}
		else if (opt == "4") {
			res.redirect('/users/topic4');
		}
		else if (opt == "5") {
			res.redirect('/users/topic5');
		}
		else if (opt == "6") {
			res.redirect('/users/topic6');
		}
		else if (opt == "7") {
			res.redirect('/users/topic7');
		}
		else if (opt == "8") {
			res.redirect('/users/topic8');
		}
		else if (opt == "9") {
			res.redirect('/users/topic9');
		}
	});
});

//increase downvotes
router.get('/downvote', ensureAuthenticated, function (req, res) {
	var tempAid = req.query.id;
	var opt = req.query.opt;
	Answer.downVote(req, res, tempAid, function (item) {
		if (opt == "1") {
			res.redirect('/users/topic1');
		}
		else if (opt == "2") {
			res.redirect('/users/topic2');
		}
		else if (opt == "3") {
			res.redirect('/users/topic3');
		}
		else if (opt == "4") {
			res.redirect('/users/topic4');
		}
		else if (opt == "5") {
			res.redirect('/users/topic5');
		}
		else if (opt == "6") {
			res.redirect('/users/topic6');
		}
		else if (opt == "7") {
			res.redirect('/users/topic7');
		}
		else if (opt == "8") {
			res.redirect('/users/topic8');
		}
		else if (opt == "9") {
			res.redirect('/users/topic9');
		}
	});
});

//increase views
router.get('/view', ensureAuthenticated, function (req, res) {
	var tempAid = req.query.id;
	var opt = req.query.opt;
	Answer.downVote(req, res, tempAid, function (item) {
		if (opt == "1") {
			res.redirect('/users/topic1');
		}
		else if (opt == "2") {
			res.redirect('/users/topic2');
		}
		else if (opt == "3") {
			res.redirect('/users/topic3');
		}
		else if (opt == "4") {
			res.redirect('/users/topic4');
		}
		else if (opt == "5") {
			res.redirect('/users/topic5');
		}
		else if (opt == "6") {
			res.redirect('/users/topic6');
		}
		else if (opt == "7") {
			res.redirect('/users/topic7');
		}
		else if (opt == "8") {
			res.redirect('/users/topic8');
		}
		else if (opt == "9") {
			res.redirect('/users/topic9');
		}
	});
});

router.get('/answer', ensureAuthenticated, function (req, res) {
	tempQid = req.query.id;
	Question.getQuestionByQid(req, res, tempQid, function (item) {
		res.render('answer', { tempQuestion: item, layout: 'layout' });
	});
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
			authorName: req.user.name,
			qid: tempQid,
			answer: ansContent
		});
		Answer.createAnswer(newAnswer, function (err, answer) {
			if (err) throw err;
			// console.log(answer);
		});
		req.flash('success_msg', 'Your answer posted successfully');
		res.redirect('/users/home');
	}
});

router.get('/ask', ensureAuthenticated, function (req, res) {
	res.render('ask', { layout: 'layout' });
});

module.exports = router;