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

		var post = new Post({
			title: req.body.username,
			body: req.body.password,
			url: req.body.email,
			dateCreated: new Date(),
			userCreated: req.user._id

    });

    // Now that the user is created, we'll attempt to save them to the
    // database.
    user.save(function(err, user){

      // If there is an error, it will come with some special codes and
      // information. We can customize the printed message based on
      // the error mongoose encounters
      if(err) {

        // By default, we'll show a generic message...
        var errorMessage = 'An error occured, please try again';

        // If we encounter this error, the duplicate key error,
        // this means that one of our fields marked as "unique"
        // failed to validate on this object.
        if(err.code === 11000){
          errorMessage = 'This user already exists.';
        }

        // Flash the message and redirect to the login view to
        // show it.
        req.flash('error', errorMessage);
        console.log("ERROR : USER EXISTS")
      }

      // If we make it this far, we are ready to log the user in.
      req.login(user, function(err){

        if(!err){res.send(user)}

        else{console.log('ERROR logging in!')}
      });
    });
  },
	}

};

module.exports = indexController;