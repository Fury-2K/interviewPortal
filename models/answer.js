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
		type: Number
	},
	upvoteCount: {
		type: Number
	},
	downvoteCount: {
		type: Number
    },
    answer: {
        type: String
    },
    updateDate: {
        type: Date
    }
}, {collection: 'answerData'});

AnswerSchema.plugin(autoIncrement.plugin, { model: 'Answer', field: 'aid' });

var Answer = module.exports = mongoose.model('Answer', AnswerSchema);

module.exports.printAnswer = function(req, res, x) {
	console.log("XX"+x);
	var query = {qid: x};
	Answer.find(query)
      .then(function(doc) {
        res.render('home', {items: doc});
      });
}