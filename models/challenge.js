/**
 * Created by user on 10/1/2017.
 */

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var challengeSchema = new Schema({
    title: { type: String, required: true, unique: true },
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
    },
    links : [{
        type : String
    }],
    files : [{
        type : String
    }]
});

var Challenge = mongoose.model('Challenge',challengeSchema);

module.exports = Challenge;