var express = require('express');
var path = require('path');
app = express();
app.use('/dist', express.static( __dirname+'/dist'));
app.get('/*', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
var port = process.env.PORT || 5000;
app.listen(port);
console.log('server started '+ port);