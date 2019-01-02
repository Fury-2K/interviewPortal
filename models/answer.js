var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Answer Schema
var AnswerSchema = mongoose.Schema({
	authorid: {
		type: Number
	},
	qid: {
		type: Number
	},
	viewCount: {
		type: Number,
		default: 0
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

module.exports.printAnswer = function(req, res, x, callback) {
	//console.log("XX"+x);
	var query = {qid: x};
	Answer.find(query)
      .then(function(doc) {
	  return callback(doc);
      });
}