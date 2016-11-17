var http = require('http');

var resin = require('resin-sdk');
var fs = require('fs');
var path = require('path');

var routes = require('./routes/index');


const bodyParser = require('body-parser');

/*var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Hello Http');
});
server.listen(8080);*/

var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', routes);

/*app.get('/', function (req, res) {
 // res.send('Hello World!');
 
});*/



app.get('/login', function (req, res) {
var token="";

var response_text="";

	resin.auth.loginWithToken(token, function(error) {
    if (error) throw error;
	});


	resin.auth.isLoggedIn().then(function(isLoggedIn) {
    if (isLoggedIn) {
        console.log('I\'m in!');
        response_text="Resin Logged in";

        


       resin.models.device.getAll().then(function(devices) {
    		console.log(devices);
			});


     /*  resin.models.os.download('raspberry-pi', function(error, stream) {
    	if (error) throw error;
   			 stream.pipe(fs.createWriteStream('foo/bar/image.img'));
   			//res.send(stream);
			});*/

		/*resin.models.device.ping('', function(error) {
   			 if (error) throw error;
		});*/



        res.send({"response":response_text});




    } else {
        console.log('Too bad!');

        response_text="Resin Not Logged in";

        res.send({"response":response_text});
    }
	});


});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
