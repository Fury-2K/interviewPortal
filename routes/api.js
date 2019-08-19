var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("../models/user");
var Question = require("../models/question");
var Answer = require("../models/answer");
var Reply = require("../models/reply");
var Topic = require("../models/topic");
var tempAid;
var tempTopic;

//index
router.get("/index", function(req, res) {
  Topic.printTopics(req, res, function(item) {
    res.json({ layout: "index", topic: item });
  });
});

//home
router.get("/home", ensureAuthenticated, function(req, res) {
  Topic.printTopics(req, res, function(item) {
    res.json({ layout: "home", topic: item });
  });
});

//topic w/h id - http://localhost:3000/api/topic?id=0
router.get("/topic", function(req, res) {
  var topicId = req.query.id;
  Question.printQuestionsByTopic(req, res, topicId, function(item) {
    Answer.printMultipleAnswers(req, res, function(item1) {
      Reply.printReply(req, res, function(item2) {
        Topic.printTopicByID(req, res, topicId, function(item3) {
          res.json({
            layout: "topic",
            items: item,
            ans: item1,
            topic: item3.content,
            topicID: topicId,
            comm: item2
          });
        });
      });
    });
  });
});

//add reply
router.post("/topic", function(req, res) {
  let aid = req.body.id;
  let authorId = req.body.uid;
  let authorName = req.body.name;
  let content = req.body.comment;

  if (aid == null) {
    res.json({ err_msg: "answerId missing" });
    return;
  }

  if (authorId == null) {
    res.json({ err_msg: "Missing authorId" });
    return;
  }

  if (authorName == null) {
    res.json({ err_msg: "Missing authorName" });
    return;
  }

  if (content == null) {
    res.json({ err_msg: "Missing CommentValue" });
    return;
  }

  var newReply = new Reply({
    aid: aid,
    authorid: authorId,
    authorName: authorName,
    content: content
  });
  Reply.createReply(newReply, function(err, reply) {
    res.json({ msg: err ? err : "Your comment posted successfully" });
  });
});

// New Topic
router.post("/nTopic", function(req, res) {
  var tp = req.body.newTopic;

  // Validation
  req.checkBody("newTopic", "Topic is required").notEmpty();

  var newTopic = new Topic({
    content: tp
  });
  Topic.createTopic(newTopic, function(err, topic) {
    if (err) throw err;
    console.log(topic);
  });
  req.flash("success_msg", "Topic added successfully");
  res.redirect("/users/ask");
});

// New Question
router.post("/ask", function(req, res) {
  var quesContent = req.body.quesContent;
  var topicArray = [];
  var n;

  Topic.findTotal(req, res, function(count) {
    n = count;
    var $i = 0;
    console.log("count- " + $i);
    for ($i = 0; $i < n; $i++) {
      if (req.body["c[" + $i + "]"]) {
        topicArray.push(req.body["c[" + $i + "]"]);
      }
    }

    // Validation
    req.checkBody("quesContent", "Question is required").notEmpty();

    var errors = req.validationErrors();

    if (!topicArray[0]) {
      Topic.printTopics(req, res, function(item) {
        res.render("ask", {
          topic: item,
          error1: "Please select atleast 1 topic"
        });
      });
    } else if (errors) {
      Topic.printTopics(req, res, function(item) {
        res.render("ask", { topic: item, errors: errors });
      });
    } else {
      var newQuestion = new Question({
        authorid: req.user.uid,
        content: quesContent,
        topic: topicArray
      });
      Question.createQuestion(newQuestion, function(err, question) {
        if (err) throw err;
        //console.log(question);
      });
      req.flash("success_msg", "Your question posted successfully");
      res.redirect("/users/home");
    }
  });
});

// Register User
router.post("/register", function(req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    //checking for email and username are already taken
    User.findOne(
      {
        username: {
          $regex: "^" + username + "\\b",
          $options: "i"
        }
      },
      function(err, user) {
        User.findOne(
          {
            email: {
              $regex: "^" + email + "\\b",
              $options: "i"
            }
          },
          function(err, mail) {
            if (user || mail) {
              res.render("register", {
                user: user,
                mail: mail
              });
            } else {
              var newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password
              });
              User.createUser(newUser, function(err, user) {
                if (err) throw err;
                console.log(user);
              });
              req.flash("success_msg", "You are registered and can now login");
              res.redirect("/users/login");
            }
          }
        );
      }
    );
  }
});

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
      if (err) throw err;
      if (!user) {
        return done(null, false, { message: "Unknown User" });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      });
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/home",
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/users/home");
  }
);

router.get("/logout", function(req, res) {
  req.logout();

  req.flash("success_msg", "You are logged out");

  res.redirect("/users/login");
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("error_msg", "Please login first");
    res.redirect("/users/login");
  }
}

//increase upvotes
router.get("/upvote", ensureAuthenticated, function(req, res) {
  var tempAid = req.query.id;
  var opt = req.query.opt;

  Answer.upVote(req, res, tempAid, function(item) {
    Topic.findTotal(req, res, function(count) {
      var $i = 0;
      var n = count;
      for ($i = 0; $i < n; $i++) {
        if (opt == $i) {
          res.redirect("/users/topic?id=" + $i);
        }
      }
    });
  });
});

//increase downvotes
router.get("/downvote", ensureAuthenticated, function(req, res) {
  var tempAid = req.query.id;
  var opt = req.query.opt;
  Answer.downVote(req, res, tempAid, function(item) {
    Topic.findTotal(req, res, function(count) {
      var $i = 0;
      var n = count;
      for ($i = 0; $i < n; $i++) {
        if (opt == $i) {
          res.redirect("/users/topic?id=" + $i);
        }
      }
    });
  });
});

//increase views
router.get("/view", ensureAuthenticated, function(req, res) {
  var tempAid = req.query.id;
  var opt = req.query.opt;
  Answer.downVote(req, res, tempAid, function(item) {
    if (opt == "1") {
      res.redirect("/users/topic1");
    } else if (opt == "2") {
      res.redirect("/users/topic2");
    } else if (opt == "3") {
      res.redirect("/users/topic3");
    } else if (opt == "4") {
      res.redirect("/users/topic4");
    } else if (opt == "5") {
      res.redirect("/users/topic5");
    } else if (opt == "6") {
      res.redirect("/users/topic6");
    } else if (opt == "7") {
      res.redirect("/users/topic7");
    } else if (opt == "8") {
      res.redirect("/users/topic8");
    } else if (opt == "9") {
      res.redirect("/users/topic9");
    }
  });
});

router.get("/answer", ensureAuthenticated, function(req, res) {
  tempQid = req.query.id;

  Question.getQuestionByQid(req, res, tempQid, function(item) {
    res.json("answer", { layout: "answer", tempQuestion: item });
  });
});

// New Answer
router.post("/answer", function(req, res) {
  var ansContent = req.body.ansContent;
  var ques = req.body.ques;
  // Validation
  req.checkBody("ansContent", "Answer is required").notEmpty();

  var errors = req.validationErrors();
  if (errors) {
    Question.getQuestionByQid(req, res, tempQid, function(item) {
      res.render("answer", {
        tempQuestion: item,
        layout: "layout",
        errors: errors
      });
    });
  } else {
    var newAnswer = new Answer({
      authorid: req.user.uid,
      authorName: req.user.name,
      qid: tempQid,
      answer: ansContent
    });
    Answer.createAnswer(newAnswer, function(err, answer) {
      if (err) throw err;
      console.log(answer);
    });
    req.flash("success_msg", "Your answer posted successfully");
    res.redirect("/users/home");
  }
});

router.get("/ask", ensureAuthenticated, function(req, res) {
  Topic.printTopics(req, res, function(item) {
    res.json({ layout: "ask", topic: item });
  });
});

module.exports = router;
