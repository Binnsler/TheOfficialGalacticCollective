var User = require('../models/user');
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
	updateUser : function(req, res){

		User.update({username: req.params.username}, req.body, function(err, userData){
			console.log('Sucessful database update.')
		});
	}

};

module.exports = indexController;