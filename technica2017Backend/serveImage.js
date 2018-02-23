const express = require('express');
var path = require('path');
const {serveImage} = require('serve-image');
 
const app = express();
//app.use(serveImage());
app.use('/static', express.static(path.join(__dirname, '../technica2017/src/images')));
app.listen(8081);
