var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Question Schema
var QuestionSchema = mongoose.Schema({
	authorid: {
		type: Number
	},
    content: {
        type: String
    },
    updateDate: {
		type: Date,
		default: Date.now
	},
	topic: {
	 	type: [Number]
	}
}, {collection: 'questionData'});

QuestionSchema.plugin(autoIncrement.plugin, { model: 'Question', field: 'qid' });

var Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.createQuestion = function(newQuestion, callback){
	newQuestion.save(callback);
}

module.exports.printQuestionsByTopic = function(req, res, x, callback) {
	var query = {topic: x};
	Question.find(query)
      .then(function(doc) {
		return callback(doc);
	});
}

module.exports.printMultipleQuestions = function(req, res, callback) {
	Question.find()
      .then(function(doc) {
		return callback(doc);
		//res.render('home', {items: doc});
	});
}

module.exports.getQuestionByQid = function(req, res, id, callback){
	var query = {qid: id};
	Question.findOne(query)
	.then(function(doc) {
		return callback(doc);
	});
}