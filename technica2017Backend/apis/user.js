var R;
var md5 = require('md5');
var zipcode = require('zipcodes');

module.exports.init = function(runtime) {
    R = runtime;
}

module.exports.signup = {
    conf: {
        handler: signup,
    },
    method: "POST"
};

module.exports.login = {
    conf: {
        handler: login,
    },
    method: "POST"
};

function signup(req, res) {
    var userData = req.payload.userData;
    userData.password = md5(userData.password);
    var location = zipcode.lookup(userData.zipCode);
    userData.city = location.city || location.state || '';
    userData.location = {};
    userData.location.lat = location.latitude;
    userData.location.lon = location.longitude;

    R.db.es.search({
        index: 'technica',
        type: 'user',
        body: {
            query: {
                match: {
                    "userName": userData.userName
                }
            },
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else if (responseFromEs.hits.hits.length == 0) {
            console.log("Reply from ES: NEW USER", responseFromEs);
            userData.nFeeds = 0;
            R.db.es.index({
                index: 'technica',
                id: userData.userName,
                type: 'user',
                body: userData
            }, function(errorFromEs, responseFromEs) {
                if (errorFromEs) {
                    return console.log("Error inserting in Elastic!", errorFromEs);
                } else {
                    console.log("new user created", responseFromEs);
                    return res.sendJson({
                        code: 200,
                        message: 'Successfully signed up',
                        token: md5(userData.userName),
			data: userData
                    }, 200);
                }
            });
        } else {
            console.log("user already exists");
            return res.sendJson({
                code: 300,
                message: 'Username exists'
            }, 200);
        }
    });
}

function login(req, res) {
    console.log(req.payload.userData);
    var userData = req.payload.userData;
    userData.password = md5(userData.password);

    R.db.es.search({
        index: 'technica',
        type: 'user',
        body: {
            query: {
                "bool": {
                    "must": [{
                            "term": {
                                "userName": userData.userName
                            }
                        },
                        {
                            "term": {
                                "password": userData.password
                            }
                        }
                    ]
                }
            },
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else if (responseFromEs.hits.hits.length == 0) {
            return res.sendJson({
                code: 301,
                message: 'Invalid username or password',
            }, 200);
        } else {
            console.log("Successful login", responseFromEs.hits.hits, userData);
            return res.sendJson({
                code: 200,
                message: 'Successful login',
                token: md5(userData.userName),
                data: responseFromEs.hits.hits[0]._source
            }, 200);
        }
    });
}
