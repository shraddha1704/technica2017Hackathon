"use strict";

var microsoftTranslator = require('mstranslator');
var R;
var md5 = require('md5');
var zipcode = require('zipcodes');

module.exports.init = function(runtime) {
    R = runtime;
}

module.exports.translate = {
    conf: {
        handler: translate,
    },
    method: "POST"
}; 

module.exports.getAvailableLanguages = {
    conf: {
        handler: getAvailableLanguages,
    },
    method: "POST"
};

var translatorClient = new microsoftTranslator({
	"api_key": "96c64f25d0654420b4455e9c361d3311"
}, true);
 

function translate(req, resp){
	var text = req.payload.text;
	var currentLang = req.payload.fromLang;
	var translateToLang = req.payload.toLang || "en";

	var dataToTranslator = {
		"text": text,
		"from": currentLang,
		"to": translateToLang
	}

	translatorClient.translate(dataToTranslator, function(err, data) {
	  // console.log(data);
	  resp.sendJson({
	  	"code": 200,
	  	"translated": data
	  });
	});
}

function getAvailableLanguages(req, resp){
	var locale = req.payload.locale || "en";
	translatorClient.getLanguagesForTranslate(function(err, data) {
		console.log(data);
		translatorClient.getLanguageNames({
			"locale": "en", 
			"languageCodes": data
		}, function(err, data2){
			var languages = {};
			for(var i in data2){
				languages[data2[i]] = data[i];
			}
			resp.sendJson({
				"code": 200,
				"languages": languages
			});
	  		// console.log(data2);
		})
	});
}



// translate({
// 	"payload": {
// 		"text": "This is some text!",
// 		"fromLang": "en",
// 		"toLang": "hi"
// 	}
// })

// getAvailableLanguages({},{})
