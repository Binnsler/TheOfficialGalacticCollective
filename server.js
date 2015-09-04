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

// Controllers
var indexController = require('./controllers/index.js');
var authenticationController = require('./controllers/authenticate.js')

// Allows you to accept multipart form data
var multer = require('multer');
var upload = multer({ dest: '/uploads' })

// AWS Stuff
var AWS = require('aws-sdk');
var s3 = new AWS.S3();


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Connect to DB (for messing around in localhost)
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/galactic-collective');

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


// HTTP ROUTES

// Initial route to create Angular shell
app.get('/', indexController.index);

// Angular Dynamic Page Rendering
app.get('/views/:page', indexController.views)

// Angular Dynamic Profile Rendering
app.get('/api/profiles/:username', indexController.getUser)

// Update Profile via Submit Button
app.post('/api/profiles/:username', indexController.updateUser)

// Upload Profile Pic
app.post('/uploadForm', upload.single(), indexController.uploadForm)

// Get all users
app.get('/api/allUsers', indexController.getAllUsers)

// Create a Post (on Community Page)
app.post('/api/posts', indexController.createPost)

// Get all Posts
app.get('/api/allPosts', indexController.getAllPosts)

// Get all of a User's Posts
app.get('/api/allUserPosts', indexController.getAllUserPosts)

// Post +1 Community Page
app.post('/api/ilikethispostcommunity', indexController.iLikeThisPostCommunity)

// Post +1 Profile Page
app.post('/api/ilikethispostprofile', indexController.iLikeThisPostProfile)

// Delete Post Community Page
app.delete('/api/posts/:id', indexController.deletePost)

// Authentication Routes
app.post('/login', authenticationController.processLogin); 

app.post('/signup', authenticationController.processSignup)

app.post('/logout', authenticationController.logout)


// Check who is currently logged in
app.get('/api/me', indexController.authenticate)


// PASSPORT PROTECTED ROUTES
// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
// app.use(passportConfig.ensureAuthenticated);

// Our server
var port = process.env.PORT || 9359
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + port);
});
