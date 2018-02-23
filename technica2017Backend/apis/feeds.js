var R;
var md5 = require('md5');
var base64Img = require('base64-img');

module.exports.init = function(runtime) {
    R = runtime;
}

module.exports.insert = {
    conf: {
        handler: insert,
    },
    method: "POST"
};

module.exports.myfeeds = {
    conf: {
        handler: myfeeds,
    },
    method: "POST"
};

module.exports.getfeeds = {
    conf: {
        handler: getfeeds,
    },
    method: "POST"
};

function insert(req, res) {
    var userData = req.payload.data.userData;
    var feedData = req.payload.data.feedData;
    feedData.timestamp = new Date().getTime();
    var userName = userData.userName;
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
        if (errorFromEs && responseFromEs && responseFromEs.hits && responseFromEs.hits.hits && responseFromEs.hits.hits.length == 0) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else {
            console.log("USER details ", responseFromEs.hits.hits[0]);
	    userData.nFeeds = parseInt(responseFromEs.hits.hits[0]._source.nFeeds) + 1 || 1;
	    console.log("nfeeds  ", userData);
            base64Img.img(feedData.image, '../technica2017/src/images', 'user_' + userName + '_feed_' + userData.nFeeds, (err, filePath) => {
		delete feedData.image;
                if (!responseFromEs.hits.hits[0]._source.feeds) {
                    responseFromEs.hits.hits[0]._source.feeds = [];
                }
                responseFromEs.hits.hits[0]._source.feeds.push('user_' + userName + '_feed_' + userData.nFeeds);
                userData.feeds = responseFromEs.hits.hits[0]._source.feeds;
                R.db.es.update({
                    index: 'technica',
                    id: userData.userName,
                    type: 'user',
                    body: { doc : userData }
                }, function(errorFromEs, responseFromEs) {
                    if (errorFromEs) {
                        return console.log("Error inserting in Elastic!", errorFromEs);
                    } else {
                        console.log("new user updated", responseFromEs);
                        feedData.userName = userData.userName;
                        feedData.feedId = 'user_' + userName + '_feed_' + userData.nFeeds;

                        R.db.es.index({
                            index: 'technica',
                            id: 'user_' + userName + '_feed_' + userData.nFeeds,
                            type: 'feeds',
                            body: feedData
                        }, function(errorFromEs, responseFromEs) {
                            if (errorFromEs) {
                                return console.log("Error inserting in Elastic!", errorFromEs);
                            } else {
                                console.log("new user updated", responseFromEs);
                                return res.sendJson({
                                    code: 200,
                                    message: 'Successfully inserted'
                                }, 200);
                            }

                        });
                    }
                });
            });
        }
    });
}

function myfeeds(req, res) {
    var userData = req.payload.userData;

    R.db.es.search({
        index: 'technica',
        type: 'feeds',
        body: {
            query: {
                match: {
                    "userName": userData.userName
                }
            },
            "sort": [{
                "timestamp": {
                    "order": "desc"
                }
            }]
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs && responseFromEs.hits.hits.length == 0) {
            return console.log("Error inserting in Elastic!", errorFromEs);
        } else {
            return res.sendJson({
                code: 200,
                message: 'Feeds received',
                data: responseFromEs.hits.hits
            });
        }
    });
}

function getfeeds(req, res) {
    var userData = req.payload.userData;

    R.db.es.search({
        index: 'technica',
        type: 'feeds',
        body: {
            query: {
                "bool": {
                    "must_not": {
                        "term": {
                            "userName": userData.userName
                        }
                    }
                }
            },
            "sort": [{
                "timestamp": {
                    "order": "desc"
                }
            }]
        }
    }, function(errorFromEs, responseFromEs) {
        if (errorFromEs || ( responseFromEs && responseFromEs.hits && responseFromEs.hits.hits && responseFromEs.hits.hits.length == 0)) {    
		return res.sendJson({
			code: 400
		}, 400);;
        } else {
            return res.sendJson({
                code: 200,
                message: 'Feeds received',
                data: responseFromEs.hits.hits
            });
        }
    });
}
