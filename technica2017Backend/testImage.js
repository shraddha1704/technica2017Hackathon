var base64Img = require('base64-img');
var url = 'http://gotechnica.org/img/logos/logo-black.png';
var bData = '';

base64Img.requestBase64(url, function(err, res, body) {
  console.log(err,res,body);
  bData = body;
  base64Img.img(bData, '../technica2017/images', '1', function(err, filepath) {console.log(err, filepath)});
});


