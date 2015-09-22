var User = require('../models/user');
var Post = require('../models/post');
var mongoose = require('mongoose');
var fs = require("fs");
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

  	getPost : function(req, res){
  		console.log('Getting a post now.');
  		Post.findOne({_id: req.params.id}).populate('userCreated').exec(function(err, postData){
			res.send(postData);
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

		// CHECK IF THE IP USER ALREADY LIKED THIS POST
		Post.find({_id: req.body._id}, function(err, userData){
			console.log("userData.likedbyIP.length.BELOW!!!");
			console.log(userData.likedByIp.length);
			if(
				userData.likedByIp === undefined || userData.likedByIp.indexOf(req.body.userIP) === -1
				){
					Post.findOneAndUpdate({_id: req.body._id}, {$inc: {likes: 1}}, function(err, userData){
						// console.log('This is the backend error: ', err)
						console.log("Req.body.userIP.BELOW!!!")
						console.log(req.body.userIP)
						// res.send(req.body)
					});

					Post.findOneAndUpdate({_id: req.body._id}, {$push: {likedByIp: req.body.userIP}}, function(err, userData){
						// console.log('This is the backend error: ', err)
						console.log(req.body)
						console.log(req.body.userIP)
						// res.send(req.body)
					});
			
					User.findOneAndUpdate({_id: req.body.userCreated._id}, {$inc: {likes: 1}}, function(err, userData){
						console.log('This is the backend error: ', err)
					});

					res.send('Successfully liked this post.')

				};
				//  else {
				// 	console.log('userIP already exists in server.')
				// }

		})

		

	},

	deletePost : function(req, res){
		Post.remove({ _id: req.params.id }, function(err, response) {
    		res.send(response);
		});
	},

	uploadForm : function(req, res){

		// AWS Credientials are stored in the Environment Keys In Heroku
		// process.env.AWS_ACCESS_KEY_ID
		// process.env.AWS_SECRET_ACCESS_KEY


		console.log("The Req.file is: " + req.file)

		if(req.file !== undefined){
			s3.putObject({
				Key: req.body._id,
				Bucket: "galacticcollective",
				ACL:"public-read-write",
				Body: fs.createReadStream(req.file.path)
			}, function(error, data) {
				if(error){
					console.log('AWS Error: ' + error)	
				}
				else{
					User.findOneAndUpdate({username: req.body.username}, {profilePic : 'https://s3-us-west-2.amazonaws.com/galacticcollective/' + req.body._id}, function(err, userData){
						if(err){
							console.log('Database error : ' + err)						
						}
						else{
							console.log('User Data : ' + userData)
							// res.send(userData);
							console.log('User profile picture updated.')
						}
					});
				}

			});
		};

	},

	uploadPortfolioOneForm : function(req, res){

		// AWS Credientials are stored in the Environment Keys In Heroku
		// process.env.AWS_ACCESS_KEY_ID
		// process.env.AWS_SECRET_ACCESS_KEY


		console.log("Starting upload to portfolioOnePic")

		if(req.file !== undefined){
			s3.putObject({
				Key: "portfolioOnePic" + req.body._id,
				Bucket: "galacticcollective",
				ACL:"public-read-write",
				Body: fs.createReadStream(req.file.path)
			}, function(error, data) {
				if(error){
					console.log('AWS Error: ' + error)	
				}
				else{
					User.findOneAndUpdate({username: req.body.username}, {portfolioOnePic : 'https://s3-us-west-2.amazonaws.com/galacticcollective/portfolioOnePic' + req.body._id}, function(err, userData){
						if(err){
							console.log('Database error : ' + err)						
						}
						else{
							// res.send(userData);
							console.log('Updated portfolioOnePic')
						}
					});
				}

			});
		};

	},

	uploadPortfolioTwoForm : function(req, res){

		// AWS Credientials are stored in the Environment Keys In Heroku
		// process.env.AWS_ACCESS_KEY_ID
		// process.env.AWS_SECRET_ACCESS_KEY


		console.log("The Req.file is: " + req.file)

		if(req.file !== undefined){
			s3.putObject({
				Key: "portfolioTwoPic" + req.body._id,
				Bucket: "galacticcollective",
				ACL:"public-read-write",
				Body: fs.createReadStream(req.file.path)
			}, function(error, data) {
				if(error){
					console.log('AWS Error: ' + error)	
				}
				else{
					User.findOneAndUpdate({username: req.body.username}, {portfolioTwoPic : 'https://s3-us-west-2.amazonaws.com/galacticcollective/portfolioTwoPic' + req.body._id}, function(err, userData){
						if(err){
							console.log('Database error : ' + err)						
						}
						else{
							console.log('User Data : ' + userData)
							// res.send(userData);
							console.log('User profile picture updated.')
						}
					});
				}

			});
		};

	},

	uploadPortfolioThreeForm : function(req, res){

		// AWS Credientials are stored in the Environment Keys In Heroku
		// process.env.AWS_ACCESS_KEY_ID
		// process.env.AWS_SECRET_ACCESS_KEY


		console.log("The Req.file is: " + req.file)

		if(req.file !== undefined){
			s3.putObject({
				Key: "portfolioThreePic" + req.body._id,
				Bucket: "galacticcollective",
				ACL:"public-read-write",
				Body: fs.createReadStream(req.file.path)
			}, function(error, data) {
				if(error){
					console.log('AWS Error: ' + error)	
				}
				else{
					User.findOneAndUpdate({username: req.body.username}, {portfolioThreePic : 'https://s3-us-west-2.amazonaws.com/galacticcollective/portfolioThreePic' + req.body._id}, function(err, userData){
						if(err){
							console.log('Database error : ' + err)						
						}
						else{
							console.log('User Data : ' + userData)
							// res.send(userData);
							console.log('User profile picture updated.')
						}
					});
				}

			});
		};

	}
}


module.exports = indexController;