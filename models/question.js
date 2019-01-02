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
	}
	// topic: {
	// 	type: Array[]
	// }
}, {collection: 'questionData'});

QuestionSchema.plugin(autoIncrement.plugin, { model: 'Question', field: 'qid' });

var Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.createQuestion = function(newQuestion, callback){
	newQuestion.save(callback);
}

module.exports.printQuestion = function(req, res, callback) {
	Question.findOne()
      .then(function(doc) {
		//console.log("XX"+doc.qid);
		res.render('home', {items: doc});
		return callback(doc);
	});
}

module.exports.printMultipleQuestions = function(req, res) {
	Question.find()
      .then(function(doc) {
		res.render('home', {items: doc});
	});
}

module.exports.getQuestionByQid = function(id, callback){
	console.log("asdsa-"+id);
	var query = {qid: id};
	Question.findOne(query)
	.then(function(doc) {
		console.log("fghgf"+doc);
		return callback(doc);
	});
}