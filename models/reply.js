var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Reply Schema
var ReplySchema = mongoose.Schema({
	aid: {
		type: Number
	},
	authorid: {
		type: Number
	},
	authorName: {
		type: String
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
		type: Date,
		default: Date.now
    }
}, {collection: 'replyData'});

ReplySchema.plugin(autoIncrement.plugin, { model: 'Reply', field: 'rid' });

var Reply = module.exports = mongoose.model('Reply', ReplySchema);

module.exports.createReply = function(newReply, callback){
	newReply.save(callback);
}

module.exports.printReply = function(req, res, callback) {
	//console.log("XX"+x);
	//var query = {aid: x};
	Reply.find()
      .then(function(doc) {
		  //console.log(doc);
	  return callback(doc);
      });
}