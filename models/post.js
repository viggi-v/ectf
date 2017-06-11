/**
 * Created by user on 6/9/2017.
 */

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var postSchema = new Schema({
    title : {type : String, required : true},
    content : {type : String, required: true},
    author  : {type : Schema.Types.ObjectId, ref : "User"},
    comments : [{
        text : String,
        author : {type:Schema.Types.ObjectId, ref : "User"}
    }]
});

var Post = mongoose.model('Post',postSchema);
module.exports = Post;