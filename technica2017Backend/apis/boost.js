var R;
var md5 = require('md5');

module.exports.init = function(runtime) {
    R = runtime;
}

module.exports.like = {
    conf: {
        handler: like,
    },
    method: "POST"
};

module.exports.sponsor = {
    conf: {
        handler: sponsor,
    },
    method: "POST"
};

function like(req, res) {
    var userData = req.payload.data.userData;
    var feedData = req.payload.data.feedData;

    R.db.es.search({
        index: 'technica',
        type: 'feeds',
        body: {
            query: {
                match: {
                    "feedId": feedData.feedId
                }
            },
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs && responseFromEs.hits.hits.length == 0) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else {
            console.log("Reply from ES: NEW USER", responseFromEs);
            var temp = {};
            temp.data = responseFromEs.hits.hits[0]._source;
            if (responseFromEs.hits.hits[0]._source.likedBy && responseFromEs.hits.hits[0]._source.likedBy.indexOf(userData.userName) != -1) {
                temp.data.likes = parseInt(responseFromEs.hits.hits[0]._source.likes) - 1;
                temp.data.likedBy.splice(responseFromEs.hits.hits[0]._source.likedBy.indexOf(userData.userName), 1);
            } else {
                if (!responseFromEs.hits.hits[0]._source.likedBy) {
                    temp.data.likedBy = [];
                    temp.data.likes = 0;
                }
                temp.data.likedBy.push(userData.userName);
                temp.data.likes = parseInt(responseFromEs.hits.hits[0]._source.likes) + 1;
            }
            R.db.es.create({
                index: 'technica',
                id: feedData.feedId,
                type: 'feeds',
                body: temp.data
            }, function(errorFromEs, responseFromEs) {
                if (errorFromEs) {
                    return console.log("Error inserting in Elastic!", errorFromEs);
                } else {
                    console.log("new user created", responseFromEs);
                    return res.sendJson({
                        code: 200,
                        message: 'Successfully signed up',
                        token: md5(userData.userName)
                    }, 200);
                }
            });
        }
    });
}

function sponsor(req, res) {
    var userData = req.payload.data.userData;
    var feedData = req.payload.data.feedData;

    R.db.es.search({
        index: 'technica',
        type: 'feeds',
        body: {
            query: {
                match: {
                    "feedId": feedData.feedId
                }
            },
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs && responseFromEs.hits.hits.length == 0) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else {
            console.log("Reply from ES: NEW USER", responseFromEs);
            var temp = {};
            temp.data = responseFromEs.hits.hits[0]._source;
            if (responseFromEs.hits.hits[0]._source.sponsoredBy && responseFromEs.hits.hits[0]._source.sponsoredBy.indexOf(userData.userName) != -1) {
                temp.data.likes = parseInt(responseFromEs.hits.hits[0]._source.sponsors) - 1;
                temp.data.likedBy.splice(responseFromEs.hits.hits[0]._source.sponsoredBy.indexOf(userData.userName), 1);
            } else {
                if (!responseFromEs.hits.hits[0]._source.sponsoredBy) {
                    temp.data.sponsoredBy = [];
                    temp.data.sponsors = 0;
                }
                temp.data.sponsoredBy.push(userData.userName);
                temp.data.sponsors = parseInt(responseFromEs.hits.hits[0]._source.sponsors) + 1;
            }
            R.db.es.create({
                index: 'technica',
                id: feedData.feedId,
                type: 'feeds',
                body: temp.data
            }, function(errorFromEs, responseFromEs) {
                if (errorFromEs) {
                    return console.log("Error inserting in Elastic!", errorFromEs);
                } else {
                    console.log("new user created", responseFromEs);
                    return res.sendJson({
                        code: 200,
                        message: 'Successfully signed up',
                        token: md5(userData.userName)
                    }, 200);
                }
            });
        }
    });
}
