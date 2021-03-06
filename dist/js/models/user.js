var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

/**
 * Create a schema (blueprint) for all users in the database.
 * If you want to collect additional info, add the fields here.
 * We are setting required to true so that if the field is not
 * given, the document is not inserted. Unique will prevent
 * saving if a duplicate entry is found.
 */

// User Schema
var userSchema = mongoose.Schema({

  username : {type: String, required: true, unique: true},
  email : {type: String, required: true, unique: true},
  password : {type: String, required: true},
  profilePic : {type: String, default: 'https://s3-us-west-2.amazonaws.com/galacticcollective/test_profile_pic.png'},
  profileName : {type: String, default: 'Profile Name'},
  profileLocation : {type: String, default: 'Location, LO'},
  profileBlurb : {type: String, default: '160 character blurb.' },
  buttonOneText : {type: String, default: 'Button 1'},
  buttonOneUrl : {type: String, default: 'www.youtube.com/watch?v=UyRP3QdDz0s'},
  buttonTwoText : {type: String, default: 'Button 2'},
  buttonTwoUrl : {type: String, default: 'www.youtube.com/watch?v=UyRP3QdDz0s'},
  buttonThreeText : {type: String, default: 'Button 3'},
  buttonThreeUrl : {type: String, default: 'www.youtube.com/watch?v=UyRP3QdDz0s'},
  skills : {type: String, default: 'Skills in 250 characters.'},
  profileBio : {type: String, default: 'Bio in  250 characters'},
  backgroundColor : {type: String, default: '1ab193'},
  textColor : {type: String, default: 'white'},
  likes : {type: Number, default: 0},
  creationTimeStamp : {type: Number},
  dateCreated : {type: Date},
  portfolioOnePic : {type: String, default: 'https://s3-us-west-2.amazonaws.com/galacticcollective/default-portfolio-item'},
  portfolioOneTitle : {type: String, default: 'Portfolio One'},
  portfolioOneDesc : {type: String, default: 'Here is where the portfolio item description should go - 160 characters'},
  portfolioOneURL : {type: String, default: 'www.portfoliolink.com'},
  portfolioTwoPic : {type: String, default: 'https://s3-us-west-2.amazonaws.com/galacticcollective/default-portfolio-item'},
  portfolioTwoTitle : {type: String, default: 'Portfolio Two'},
  portfolioTwoDesc : {type: String, default: 'Here is where the portfolio item description should go - 160 characters'},
  portfolioTwoURL : {type: String, default: 'www.portfoliolink.com'},
  portfolioThreePic : {type: String, default: 'https://s3-us-west-2.amazonaws.com/galacticcollective/default-portfolio-item'},
  portfolioThreeTitle : {type: String, default: 'Portfolio Three'},
  portfolioThreeDesc : {type: String, default: 'Here is where the portfolio item description should go - 160 characters'},
  portfolioThreeURL : {type: String, default: 'www.portfoliolink.com'}


});

/**
 * This allows us to hook into the pre-save DB flow. Our
 * callback will be called whenever a new user is about to
 * be saved to the database so that we can encrypt the password.
 */
userSchema.pre('save', function(next){

  // First, check to see if the password has been modified. If not, just move on.
  if(!this.isModified('password')) return next();

  // Store access to "this", which represents the current user document
  var user = this;

  // Generate an encryption "salt." This is a special way of increasing the
  // encryption power by wrapping the given string in a secret string. Something
  // like "secretpasswordsecret" and then encrypting that result.
  bcrypt.genSalt(10, function(err, salt){

    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // If we are successful, use the salt to run the encryption on the given password
    bcrypt.hash(user.password, salt, function(err, hash){

      // If there was an error, allow execution to move to the next middleware
      if(err) return next(err);

      // If the encryption succeeded, then replace the un-encrypted password
      // in the given document with the newly encrypted one.
      user.password = hash;

      // Allow execution to move to the next middleware
      return next();
    });
  });
});


/**
 * Method on the user schema that allows us to hook into the
 * bcrypt system to compare an encrypted password to a given
 * password. This process doesn't involve unencrypting the stored
 * password, but rather encrypts the given one in the same way and
 * compares those values
 */
userSchema.methods.comparePassword = function(candidatePassword, next){
  // Use bcrypt to compare the unencrypted value to the encrypted one in the DB
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // If there is no error, move to the next middleware and inform
    // it of the match status (true or false)
    return next(null, isMatch);
  });
};

// Our user model
var User = mongoose.model('User', userSchema);

// Make user model available through exports/require
module.exports = User;