/**
 * Created by user on 6/9/2017.
 */

var mongoose = require("mongoose");
var properties = require("../bin/properties");
var Schema = mongoose.Schema;
console.log(properties.db_properties);
var postSchema = new Schema({
    title : {type : String, required : true},
    content : {type : String, required: true},
    author  : {type : Schema.Types.ObjectId, ref : "User"}
});

var Post = mongoose.model('Post',postSchema);
module.exports = Post;