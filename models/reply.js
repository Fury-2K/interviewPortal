var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Reply Schema
var ReplySchema = mongoose.Schema({
	qid: {
		type: Number
	},
	authorid: {
		type: Number
	},
	// upvoteCount: {
	// 	type: Number
	// },
	// downvoteCount: {
	// 	type: Number
    // },
    content: {
        type: String
    },
    updateDate: {
        type: Date
    }
}, {collection: 'replyData'});

ReplySchema.plugin(autoIncrement.plugin, { model: 'Reply', field: 'rid' });

var Reply = module.exports = mongoose.model('Reply', ReplySchema);