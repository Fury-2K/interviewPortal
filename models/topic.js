var mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

// Question Schema
var TopicSchema = mongoose.Schema({
    content: {
        type: String
    }
}, {collection: 'topicData'});

TopicSchema.plugin(autoIncrement.plugin, { model: 'Topic', field: 'tid'});

var Topic = module.exports = mongoose.model('Topic', TopicSchema);

module.exports.createTopic = function(newTopic, callback){
	newTopic.save(callback);
}

module.exports.printTopics = function(req, res, callback) {
	Topic.find()
      .then(function(doc) {
		return callback(doc);
		//res.render('home', {items: doc});
	});
}

module.exports.printTopicByID = function(req, res, x, callback) {
    var query = {tid: x};
    Topic.findOne(query)
      .then(function(doc) {
		return callback(doc);
		//res.render('home', {items: doc});
	});
}

module.exports.findTotal = function(req, res, callback) {
	Topic.find().count()
	.then(function(doc){
		return callback(doc);
	});
}