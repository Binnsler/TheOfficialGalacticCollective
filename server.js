var express = require('express');
var bodyParser = require('body-parser');
// We need database persistence
var mongoose = require('mongoose');

// Express Session allows us to use Cookies to keep track of
// a user across multiple pages. We also need to be able to load
// those cookies using the cookie parser
var session = require('express-session');
var cookieParser = require('cookie-parser');

// Flash allows us to store quick one-time-use messages
// between views that are removed once they are used.
// Useful for error messages.
var flash = require('connect-flash');

// Load in the base passport library so we can inject its hooks
// into express middleware.
var passport = require('passport');

// Load in our passport configuration that decides how passport
// actually runs and authenticates
var passportConfig = require('./config/passport');

// Index Controller
var indexController = require('./controllers/index.js');
// Passport Controller
var authenticationController = require('./controllers/authenticate.js')

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Connect to DB
mongoose.connect('mongodb://localhost/galactic-collective');

// Passport Stuff
// Add in the cookieParser and flash middleware so we can
// use them later
app.use(cookieParser());
app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());

// ROUTES

// Initial route to create Angular shell
app.get('/', indexController.index);

// Angular Dynamic Page Rendering
app.get('/views/:page', indexController.views)

// Authentication Routes
// app.get('/login', authenticationController.login);

app.post('/login', authenticationController.processLogin); // Get route that res.sends data to be used by Angular callback

app.post('/signup', authenticationController.processSignup)

// Successful Login
// app.get('/successfullogin', passportConfig.ensureAuthenticated, indexController.successfullogin)



// app.get('/profiles', indexController.profiles)

// PASSPORT PROTECTED ROUTES
// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
// app.use(passportConfig.ensureAuthenticated);


var server = app.listen(9359, function() {
	console.log('Express server listening on port ' + server.address().port);
});
