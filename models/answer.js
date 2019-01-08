var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Answer Schema
var AnswerSchema = mongoose.Schema({
	authorid: {
		type: Number
	},
	authorName: {
		type: String
	},
	qid: {
		type: Number
	},
	viewCount: {
		type: Number,
		default: 1
	},
	upvoteCount: {
		type: Number,
		default: 0
	},
	downvoteCount: {
		type: Number,
		default: 0
    },
    answer: {
        type: String
    },
    updateDate: {
		type: Date,
		default: Date.now
    }
}, {collection: 'answerData'});

AnswerSchema.plugin(autoIncrement.plugin, { model: 'Answer', field: 'aid' });

var Answer = module.exports = mongoose.model('Answer', AnswerSchema);

module.exports.createAnswer = function(newAnswer, callback){
	newAnswer.save(callback);
}

module.exports.printMultipleAnswers = function(req, res, callback) {
	Answer.find()
      .then(function(doc) {
		return callback(doc);
		//res.render('home', {items: doc});
	});
}

module.exports.printAnswer = function(req, res, x, callback) {
	//console.log("XX"+x);
	var query = {qid: x};
	Answer.find(query)
      .then(function(doc) {
		  //console.log(doc);
	  return callback(doc);
      });
}

module.exports.upVote = function(req, res, x, callback) {
	var query = {aid: x};
	Answer.findOne(query)
	.then(function(doc) {
		doc.upvoteCount=doc.upvoteCount+1;
		doc.save();
		return callback(doc);
	});
}

module.exports.downVote = function(req, res, x, callback) {
	var query = {aid: x};
	Answer.findOne(query)
	.then(function(doc) {
		doc.downvoteCount=doc.downvoteCount+1;
		doc.save();
		return callback(doc);
	});
}

module.exports.viewed = function(req, res, x, callback) {
	var query = {aid: x};
	Answer.findOne(query)
	.then(function(doc) {
		doc.viewCount=doc.viewCount+1;
		doc.save();
		return callback(doc);
	});
}