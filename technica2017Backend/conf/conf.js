module.exports.dev = {
	logger :  {
		name:"technica",
		streams :[{ path:"./amp", stream: process.stdout}],
		level: 'trace'
	},
	timeout: 10000,
    es:{
        hosts: ['127.0.0.1:9200']
    },
    env: 'dev'
};

