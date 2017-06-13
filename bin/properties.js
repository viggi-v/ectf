/**
 * Created by user on 6/7/2017.
 */
var dbProps = {
    adminPassword : "0D52A26ACFC79F227419C268D60C1FC4D1B5FD6AFF8243FC98F27B73652802F5",
    // I think they won't guess it :P
    prod: {
        url:""
    },
    dev: {
        //url: "mongodb://localhost:27017"
        url: "mongodb://sva:sva97@ds119772.mlab.com:19772/ieeespwd"
    }
};

exports.db_properties = dbProps;
