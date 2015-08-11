var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	views : function(req, res){
		// req.params.templateName
		res.render(req.params.page);
	},
	successfullogin : function(req, res){
		res.send(req.user);
		console.log('We have successfully logged in')
	}

};

module.exports = indexController;