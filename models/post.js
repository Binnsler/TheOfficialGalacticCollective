var mongoose = require('mongoose');

var postSchema = mongoose.Schema({

  title : {type: String, required: true},
  body : {type: String, required: true},
  type : {type: String, required: true},
  url : {type: String},
  dateCreated : {type: Number},
  userCreated : {type: mongoose.Schema.ObjectId, ref: 'User'}, 
  time : {type: Number}

});

// Our user model
var Post = mongoose.model('post', postSchema);

// Make user model available through exports/require
module.exports = Post;