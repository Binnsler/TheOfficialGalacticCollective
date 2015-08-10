var indexController = {
	search: function(req, res) {
		res.render('search');
	},
	login: function(req, res) {
		res.render('login');
	}

};

module.exports = indexController;