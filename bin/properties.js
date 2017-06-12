/**
 * Created by user on 6/7/2017.
 */
var dbProps = {
    cryptoKey : "I'm1r0nM@n!!!",
    adminPassword : "I'mTheFuckinAdmin",
    prod: {
        url:""
    },
    dev: {
        //url: "mongodb://localhost:27017"
        url: "mongodb://sva:sva97@ds119772.mlab.com:19772/ieeespwd"
    }
};

exports.db_properties = dbProps;
