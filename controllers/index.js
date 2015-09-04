var User = require('../models/user');
var Post = require('../models/post');
var mongoose = require('mongoose');
var AWS = require('aws-sdk');
var s3 = new AWS.S3();

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

    		Post.findOne({_id: post._id}).populate('userCreated').exec(function(err, post){
	    		res.send(post)
    		});

	    });
  	},

  	getAllPosts : function(req, res){
		Post.find({}).populate('userCreated').exec(function(err, allPosts){
			res.send(allPosts);
		});
	},
	
	getAllUserPosts : function(req, res){
		User.findOne({username : req.query.username}, function(err, user){
			if(user){
				Post.find({userCreated: user._id}, function(err, allPosts){
					res.send(allPosts);
				});
			}
			else {
				res.send([]);
			}

		});
	},

	iLikeThisPostProfile : function(req, res){
		Post.findOneAndUpdate({_id: req.body._id}, {$inc: {likes: 1}}, function(err, userData){
			console.log('This is the backend error: ', err)
			res.send(userData)
		});
		console.log(req.body.userCreated._id)
		User.findOneAndUpdate({_id: req.body.userCreated}, {$inc: {likes: 1}}, function(err, userData){
			console.log('This is the backend error: ', err)
		});
	},

	iLikeThisPostCommunity : function(req, res){
		Post.findOneAndUpdate({_id: req.body._id}, {$inc: {likes: 1}}, function(err, userData){
			console.log('This is the backend error: ', err)
			res.send(userData)
		});
		
		User.findOneAndUpdate({_id: req.body.userCreated._id}, {$inc: {likes: 1}}, function(err, userData){
			console.log('This is the backend error: ', err)
		});
	},

	deletePost : function(req, res){
		Post.remove({ _id: req.params.id }, function(err, response) {
    		res.send(response);
		});
	},

	uploadForm : function(req, res){

		// var params = {
	 //      Bucket: 'galacticcollective',
	 //      Key: req.file.name,
	 //      Body: req.file
  //   	};

	 //    s3.putObject(params, function (perr, pres) {
	 //      if (perr) {
	 //        console.log("Error uploading data: ", perr);
	 //      } else {
	 //        console.log("Successfully uploaded data to myBucket/myKey");
	 //      }
	 //    });
		
		console.log(req.body);
		console.log(req.file);
		// res.send(data)
	}
}


module.exports = indexController;