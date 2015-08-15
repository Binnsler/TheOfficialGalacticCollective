var User = require('../models/user');
var Post = require('../models/post');
var mongoose = require('mongoose');

var indexController = {
	index: function(req, res) {
		res.render('index', {user: req.user});
	},
	views : function(req, res){
		res.render(req.params.page, {user: req.user});
	},
	authenticate : function(req, res){
		res.send(req.user);
	},
	getUser : function(req, res){
		// findOne object, not an array of objects ex. [{one}]
		User.findOne({username: req.params.username}, function(err, userData){
			res.send(userData);
		});
	},
	getAllUsers : function(req, res){
		User.find({}, function(err, allUsers){
			res.send(allUsers);
		});
	},
	updateUser : function(req, res){

		User.update({username: req.params.username}, req.body, function(err, userData){
			console.log('Sucessful database update.')
		});
	},

	createPost : function(req, res){

		console.log('The req.body of the post: ', req.body)

		var post = new Post({
			title: req.body.title,
			body: req.body.description,
			type: req.body.type,
			url: req.body.url,
			dateCreated: new Date(),
			userCreated: req.user._id,
			time: req.body.time

		});

		// save the post os the database
    	post.save(function(err, post){

	    	res.send('Saved post to database')

	    });
  	},

  	getAllPosts : function(req, res){
		Post.find({}, function(err, allPosts){
			res.send(allPosts);
		});
	},
	
	getAllUserPosts : function(req, res){
		Post.find({}, function(err, allPosts){
			res.send(allPosts);
		});
	}
}


module.exports = indexController;