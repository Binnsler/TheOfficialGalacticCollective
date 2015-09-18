var mongoose = require('mongoose');

var postSchema = mongoose.Schema({

  title : {type: String, required: true},
  body : {type: String, required: true},
  type : {type: String, required: true},
  url : {type: String},
  dateCreated : {type: Date},
  userCreated : {type: mongoose.Schema.ObjectId, ref: 'User'}, 
  time : {type: Date},
  likes : {type: Number, default: 0},
  type: {type: String},
  likedByIp: [{type: String}, default: [{0}]

});

// Our user model
var Post = mongoose.model('post', postSchema);

// Make user model available through exports/require
module.exports = Post;