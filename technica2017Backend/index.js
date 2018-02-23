"use strict";
var http = require("http");
var url = require("url");
var parseString = require('xml2js').parseString;
var querystring = require("querystring");
var Joi = require('joi');
var fs = require("fs");
var async = require("async");
var bunyan = require("bunyan");
var _ = require("underscore");
var requireTree = require("require-tree");
var moment = require("moment");
var elasticsearch = require("elasticsearch");
//var session = require("./models/session.js");
var parser = require('ua-parser-js');
var R = {};
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
console.log(new Date(), "Starting....");
//console.log = function(){}

var conf;
var routes = {
    GET: {},
    POST: {}
};
var restRoutes = {
    GET: {},
    POST: {}
};
var validate = {
    GET: {},
    POST: {}
};
var secure = {
    GET: {},
    POST: {}
};
var timeout = {
    GET: {},
    POST: {}
};
var cache = {
    GET: {},
    POST: {}
};
var reqData = {
    GET: {},
    POST: {}
};

var runtime = {
    db: {},
    log: "",
    restRoutes: restRoutes,
    routes: routes,
};

var log;
var server = http.createServer(validateAppkey);
var serverUnix = http.createServer(validateAppkey);
var host = process.argv[2] || '0.0.0.0';
var port = process.argv[3] || 9090;
var env = process.argv[4] || 'dev';

conf = require('./conf/conf.js')[env];
runtime.conf = conf;
initDBs();


function sendJsonArray(obj, statusCode, nocache) {
    console.log(statusCode);
    this.sendJson([obj], statusCode, nocache);
}

function sendJson(obj, statusCode, nocache) {
    var s = JSON.stringify(obj);
    var expRes = this.getHeader('cacheExp');
    if (expRes) {
        var currentDateTime = new Date();
        var currHour = currentDateTime.getHours();
        var currMinutes = currentDateTime.getMinutes();
        var diff;
        var expHeader;
        //Caching on Time basis
        if (expRes > currHour) {
            diff = expRes - currHour
            expHeader = moment(moment(currentDateTime).add(moment.duration(diff, 'hours')).format()).subtract(moment.duration(currMinutes, 'minutes')).format();
            expHeader = moment(expHeader).utcOffset("+00:00")

        } else {
            diff = 24 - (currHour - expRes)
            expHeader = moment(moment(currentDateTime).add(moment.duration(diff, 'hours')).format()).subtract(moment.duration(currMinutes, 'minutes')).format();
            expHeader = moment(expHeader).utcOffset("+00:00")

        }
        this.setHeader("Expires", expHeader.toString())
    }
    this.statusCode = statusCode || 200;
    this.setHeader("Content-Type", "application/json");
    this.setHeader("Access-Control-Allow-Origin", "*");
    if (nocache || this.statusCode != 200) {
        this.removeHeader("Expires");
        this.removeHeader("Cache-Control");
    }
    var h = this.req.headers;
    if (h.reqcnt) {
        this.setHeader("respCnt", h.reqcnt);
    }

    this.end(s);
    var pathR = url.parse(this.req.url, true, true).pathname;
    var queryR = url.parse(this.req.url, true, true).query;
    var methodR = this.req.method;

    var logline = {
        appkey: h.appkey,
        vendorId: h.vendorId,
        api: this.req.apiName,
        fullApiPath: this.req.url,
        appName: h.appName,
        remoteIp: this.req.connection.remoteAddress,
        headers: h,
        userGrp: h.userGrp,
        respCnt: h.reqcnt,
        uniqueId: h.uniqueId,
        ua: h.ua,
        userDetails: h.userDetails,
        data: obj,
        payload: this.req.payload,
        respTime: new Date - this.req.reqTime,
        reqTimeMs: this.req.reqTimeMs,
        respMs: moment().valueOf(),
        version: this.req.version

    }
    // console.log("logline", logline);
    //log.logit(logline);
}

function sendtext(text, statusCode) {
    this.statusCode = statusCode || 200;
    this.setHeader("Content-Type", "text/plain");
    this.end(text);
    var h = this.req.headers;
    var logline = {
        appkey: h.appkey,
        vendorId: h.vendorId,
        appName: h.appName,
        userGrp: h.userGrp,
        uniqueId: h.uniqueId,
        ua: h.ua,
        userDetails: h.userDetails,
        data: text,
        respTime: new Date - this.req.reqTime

    };
    //log.logit(logline);
}

function redirect(location) {
    this.writeHead(301, {
        Location: location
    });
    this.end();
}


function handler(req, res) {
    var timeoutValue;
    var path = url.parse(req.url, true, true).pathname;
    req.query = url.parse(req.url, true, true).query;
    var method = req.method;
    //var headers = {};
    console.log(method);
    req.headers["Access-Control-Allow-Origin"] = "*";
    req.headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    req.headers["Access-Control-Allow-Credentials"] = false;
    req.headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    req.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Access-Control-Allow-Origin";
   // res.writeHead(200, req.headers);
    if (method == "OPTIONS") {
	console.log("in if", method)
	res.writeHead(200, req.headers);
        res.end();
    } else { 
        if (!routes[method][path]) {
            var p1 = path.split("/");
            var o = Object.keys(restRoutes[method]);
            var matched = false;
            for (var r = 0; r < o.length && matched == false; r++) {
                var rdata = restRoutes[method][o[r]];
                if (rdata.rest) {
                    if (path.indexOf(o[r] + "/") == 0) {
                        matched = true;
                        path = o[r];
                        for (var i = 0; i < rdata.split.length; i++) {
                            if (!req.params) {
                                req.params = {};
                            }
                            if (rdata.split[i] != '')
                                req.params[rdata.split[i]] = p1[rdata.skip + i];
                        }
                    }
                }
            }
            if (!matched)
                return res.sendJson({
                    code: 404,
                    message: "Not Found"
                }, 404);
        }

        //getUserDataFromSession(req, res, path, method, handleRequest)
        try {

            var useragent = req.headers['ua'] || req.headers['user-agent'];
            //	console.log('All headers', req.headers);
            console.log("User Agent", typeof useragent, useragent);
            req.headers.ua = parser(useragent.toLowerCase());
            if (!req.headers.ua.device.type)
                req.headers.ua.device.type = "phone";

        } catch (e) {
            return res.sendJson({
                code: 400,
                message: "Invalid User-Agent"
            }, 400);
        }

        if (timeout[method][path])
            timeoutValue = timeout[method][path]
        else
            timeoutValue = conf.timeout;
        res.setTimeout(parseInt(timeoutValue), timeoutHndlr)
        req.apiName = reqData[method][path].path
        req.version = reqData[method][path].version
        //device type mandatory for version greater than 2.3
        var apiVersion = (req.version).substr(1)
        if (apiVersion >= 3.4) {
            if (!(req.headers.devicetype && req.headers.os)) {
                return res.sendJson({
                    code: 400,
                    message: "devicetype and os required"
                }, 406);
            } else {
                if (secure[method][path]) {
                    validateSession(req, res, path, method, handleRequest)
                } else {
                    handleRequest(req, res, path, method);
                }


            }
        } else {
            // if (secure[method][path]) {
            // 	console.log("validateSession called");
            //     validateSession(req, res, path, method, handleRequest)
            // } else {
            handleRequest(req, res, path, method);
            // }
        }
    }
}


function validateAppkey(req, res) {
    req.reqTime = new Date()
    res.req = req;
    res.sendJson = sendJson;
    res.sendtext = sendtext;
    res.redirect = redirect;
    res.sendBuffer = sendBuffer;
    handler(req, res);
    // if (!req.headers.appkey) {
    //     return res.sendJson({
    //               code: 400,
    //               message: "API Header missing"
    //     }, 400);
    // } else {
    var key = req.headers.appkey + "::app";
    // }
}

function validateSession(req, res, path, method, cb) {
    var userDetails = {}
    req.headers.userData = {};
    var errCode;
    var apiVer = (req.version).substr(1)
    if (apiVer >= 3) {
        errCode = 419
    } else {
        errCode = 1001
    }
    if (req.version)
        if (!(req.headers.accesstoken || req.headers.ssotoken)) {
            return res.sendJson({
                code: 1001,
                message: "Token Required"

            }, 499);
            return cb(req, res, path, method);

        } else {
            var token = req.headers.accesstoken || req.headers.ssotoken;

            sessionBucket.get("ssotoken::" + token, function(err, data) {

                if (err) {
                    if (token.indexOf('AXA') != 0) {

                        session.session({
                            ssotoken: token,
                            lbcookie: req.headers.lbcookie,
                            appkey: req.headers.appkey,
                            deviceId: req.headers.deviceid,
                            deviceInfo: req.headers.ua,
                            userGrp: req.headers.userGrp
                        }, function(err, data) {
                            if (err) {

                                return res.sendJson({
                                    code: errCode,
                                    message: "Authentication failed,Invalid ssotoken",
                                    details: err.message

                                }, 419);
                            } else {

                                req.headers.uniqueId = data.uniqueId;
                                req.headers.uId = data.uId;
                                var uniqueId = data.uniqueId;
                                userDetails.uniqueId = data.uniqueId;
                                userDetails.uId = data.uId;
                                sessionBucket.get("idam::v3::" + uniqueId, function(err, idamResult) {
                                    if (err) {
                                        return cb(req, res, path, method);
                                    } else {
                                        req.headers.userGrp = idamResult.value.userType[0] || "39ee6ded40812c593ed8";
                                        userDetails.userGrp = idamResult.value.userType[0] || "39ee6ded40812c593ed8";
                                        res.setHeader("UserGrp", idamResult.value.userType[0] || "39ee6ded40812c593ed8");
                                        //           userDetails.commonName = idamResult.value.IdamRes.commonName || null;
                                        userDetails.deviceId = req.headers.deviceid;
                                        //        userDetails.subscriberId = idamResult.value.IdamRes.subscriberId;
                                        req.headers.userData = userDetails;
                                        return cb(req, res, path, method);
                                    }
                                });
                                return cb(req, res, path, method);
                            }
                        });
                    } else {
                        return res.sendJson({
                            code: errCode,
                            message: "Authentication failed,Invalid ssotoken"

                        }, 419);
                    }

                } else {
                    if (data.value.unique) {

                        req.headers.uniqueId = data.value.unique;
                        req.headers.uId = data.value.uId;
                        userDetails.uniqueId = data.value.unique;
                        userDetails.uId = data.value.uId;
                        var uniqueId = data.value.unique;
                        sessionBucket.get("idam::v3::" + uniqueId, function(err, idamResult) {
                            if (err) {
                                return cb(req, res, path, method);
                            } else {
                                //                          req.headers.commonname = idamResult.value.IdamRes.commonName || null;
                                req.headers.userGrp = idamResult.value.userType[0] || "39ee6ded40812c593ed8";
                                res.setHeader("UserGrp", idamResult.value.userType[0] || "39ee6ded40812c593ed8");
                                //                                userDetails.commonName = idamResult.value.IdamRes.commonName || null;
                                userDetails.deviceId = req.headers.deviceid;
                                //                              userDetails.subscriberId = idamResult.value.IdamRes.subscriberId;
                                req.headers.userData = userDetails;
                                return cb(req, res, path, method);
                            }
                        })
                        console.log("heasders", req.headers)
                    } else {
                        sessionBucket.get("device::" + data.value.deviceId, function(err, result) {
                            if (err) {
                                return cb(req, res, path, method);
                            } else {
                                var uniqueId = result.value.unique;
                                req.headers.uniqueId = result.value.unique;
                                req.headers.uId = result.value.uId;
                                userDetails.uniqueId = result.value.unique;
                                userDetails.uId = result.value.uId;

                                sessionBucket.get("idam::v3::" + uniqueId, function(err, idamResult) {
                                    if (err) {
                                        return cb(req, res, path, method);
                                    } else {
                                        //                                    req.headers.commonname = idamResult.value.IdamRes.commonName || null;
                                        req.headers.userGrp = idamResult.value.userType[0] || "39ee6ded40812c593ed8";
                                        res.setHeader("UserGrp", idamResult.value.userType[0] || "39ee6ded40812c593ed8");
                                        //                                        userDetails.commonName = idamResult.value.IdamRes.commonName || null;
                                        userDetails.deviceId = req.headers.deviceid;
                                        //                                      userDetails.subscriberId = idamResult.value.IdamRes.subscriberId;
                                        req.headers.userData = userDetails;
                                        return cb(req, res, path, method);
                                    }
                                })
                            }
                        })
                        console.log("headers,", req.headers)
                    }
                }


            })
            //console.log("request.headers",req.headers) 
        }

}









function timeoutHndlr(req) {
    this.sendJson({
        code: 504,
        message: "Server Timeout"
    }, 504);
}


function handleRequest(req, res, path, method) {
    req.query = url.parse(req.url, true, true).query;
    try {
        if (cache[method][path]) {
            var curDate = new Date();
            var curTime = curDate.getMinutes();
            var cacheTime = cache[method][path];

            for (var i = 1; i <= 60; i++) {
                expTime = parseInt(curTime) + i;
                if (expTime % cacheTime == 0) {
                    var curDate = moment();
                    var curTime = curDate.unix();
                    var expTime = moment().add(i, 'm').utcOffset("+00:00");
                    var ex = expTime.unix();
                    var diff = ex - curTime;
                    diff = (Math.abs(diff));
                    res.setHeader("Cache-Control", "must-revalidate, max-age=" + diff);
                    res.setHeader("Expires", expTime.toString());

                    break;
                }
            }

        }
        if (req.method == 'POST') {
            var body = '';
            req.on('data', function(data) {
                body += data;
            });
            req.on('end', function() {
                var ct = req.headers['content-type'] || 'application/json';
                try {
                    if (ct.indexOf('application/json') == 0) {
                        req.payload = JSON.parse(body);
                    } else if (ct == 'application/xml') {
                        parseString(body, function(err, result) {
                            if (err) {
                                //TODO: SEND ERROR
                                R.log.error(err)
                            } else {
                                req.payload = result;
                            }
                        });
                    } else {
                        req.payload = querystring.parse(body);
                    }
                } catch (e) {
                    //TODO: SEND ERROR
                }
                runtime.log.debug({
                    mtd: req.method,
                    api: path,
                    params: req.params,
                    payload: req.payload
                });
                validateQuery(path, method, req.query, req, res);
            });
        } else {
            runtime.log.debug({
                mtd: req.method,
                api: path,
                params: req.params,
                payload: req.payload
            });
            validateQuery(path, method, req.query, req, res);
        }
    } catch (e) {
        console.log("error", e)
        return res.sendJson({
            code: 500,
            message: "Internal Server error",
            details: e
        }, 500);
    }
}

function getValidateFunction(data, schema) {
    return function(cb) {
        Joi.validate(data, schema, cb);
    }
}

function sendBuffer(text, statusCode) {
    this.statusCode = statusCode || 200;
    this.setHeader("Content-Type", "binary/octet-stream");
    this.end(text);
    var h = this.req.headers;
    var logline = {
        appkey: h.appkey || null,
        vendorId: h.vendorId || null,
        appName: h.appName || null,
        userGrp: h.userGrp || null,
        uniqueId: h.uniqueId || null,
        ua: h.ua || null,
        userDetails: h.userDetails || null,
        data: text,
        respTime: new Date - this.req.reqTime
    }
}



function validateQuery(path, method, query, req, res) {
    if (validate[method][path]) {
        var schema = {};
        var valFuncs = {};

        if (validate[method][path].query) {
            schema = validate[method][path].query;
            valFuncs.query = getValidateFunction(query, schema);
        }
        if (validate[method][path].payload) {
            schema = validate[method][path].payload;
            valFuncs.payload = getValidateFunction(req.payload, schema);
        }
        if (validate[method][path].params) {
            schema = validate[method][path].params;
            valFuncs.params = getValidateFunction(req.params, schema);
        }
        async.parallel(valFuncs, function(err, result) {
            var keys = Object.keys(result);
            var valid = true;
            if (err)
                valid = false;

            for (var r = 0; r < keys.length; r++) {
                if (!result[keys[r]]) {
                    valid = false;
                }
            }
            if (!valid) {
                return res.sendJson({
                    code: 400,
                    message: "Parameter Missing"
                }, 400);
            } else {
                routes[method][path](req, res);
            }
        });
    } else {
        routes[method][path](req, res);
    }
}
/*
process.on('uncaughtException', function(err) {
    var curDate = new Date();
    console.log('Caught exception: ' + err, "Date:", curDate);
    R.log.debug('Caught exception: ' + err, "Date:", curDate);
    if (err.stack.indexOf('stack') != -1)
        process.exit(1)

});
*/
server.listen(port, host, function() {
    console.log('Listening at http://' + host + ':' + port, "Environment: " + env);
});
fs.unlink('/tmp/mdp_' + port, function() {
    serverUnix.listen('/tmp/mdp_' + port, function(err) {});
});

function initModels(functions, filename, path) {
    // console.log(functions, filename);
    functions.init(runtime);
}

function initUtils(functions, filename, path) {
    console.log(functions, filename);
    if (typeof functions.init == 'function')
        functions.init(runtime);
}


function initapis(functions, filename, path) {
    var apiPath = path.substring(__dirname.length, path.length - 3);
    var fun = _.without(_.keys(functions), "init");
    functions.init(runtime);
    for (var i in fun) {
        var p = apiPath + "/" + fun[i];

        var rest = false,
            split = [],
            skip = 0;

        if (functions[fun[i]].conf.addToPath) {
            if (functions[fun[i]].conf.addToPath.indexOf(":") != -1) {
                skip = p.split("/").length;
                var temp = functions[fun[i]].conf.addToPath.split("/");
                for (var j = 0; j < temp.length; j++) {
                    split.push(temp[j].substr(1));
                }
                rest = true;
            } else {
                p += "/" + functions[fun[i]].conf.addToPath;
            }
        }
        p = p.toLowerCase();
        restRoutes[functions[fun[i]].method][p] = {
            rest: rest,
            split: split,
            skip: skip
        };
        var pSplit = p.split("/")
        var version = pSplit[3]
        routes[functions[fun[i]].method][p] = functions[fun[i]].conf.handler;
        reqData[functions[fun[i]].method][p] = {
            path: p,
            version: version

        }
        if (functions[fun[i]].conf.validate)
            validate[functions[fun[i]].method][p] = functions[fun[i]].conf.validate;

        if (!functions[fun[i]].conf.insecure)
            secure[functions[fun[i]].method][p] = true;

        if (functions[fun[i]].conf.cache)
            cache[functions[fun[i]].method][p] = functions[fun[i]].conf.cache;

        if (functions[fun[i]].conf.timeout)
            timeout[functions[fun[i]].method][p] = functions[fun[i]].conf.timeout;
    }

}

function init() {
    requireTree("./apis/", {
        each: initapis
    });
    console.log(routes);
}

function initDBs() {
    runtime.conf = conf;
    runtime.port = port;
    conf.logger.name += "_" + host + ":" + port;
    conf.logger.streams[0].path += "_" + host + ":" + port + ".log";
    var bun = bunyan.createLogger(conf.logger);

    runtime.log = bun;
    log = runtime.log;
    //log.logit('Starting======================')

    if (conf.redis) {
        log.debug("Connecting to redis", conf.redis);

        runtime.db.redis = redis.createClient(conf.redis);
    }

    if (conf.es) {
        log.debug("Connecting to Elasticsearch", conf.es);

        runtime.db.es = new elasticsearch.Client(conf.es);
    }
    init();
    R = runtime;
}
