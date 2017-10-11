/**
 * Created by user on 10/1/2017.
 */

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var challengeSchema = new Schema({
    title: { type: String, required: true, unique: true },
    link : { type : String, required : true, unique : true},
    points : {
        type : Number,
        required : true
    },
    flag : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    }
});
challengeSchema
    .path('link')
    .validate(function(value,respond){
        return !(/[^a-zA-Z0-9 _]/.test(value));
    },'Invalid link format, cannot contain special chars.');
var Challenge = mongoose.model('Challenge',challengeSchema);

module.exports = Challenge;