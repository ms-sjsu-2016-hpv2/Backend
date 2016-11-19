var http = require('http');

var resin = require('resin-sdk');
var fs = require('fs');
var path = require('path');

var backend = require('./routes/backend');
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
app.post('/register_mydevice', backend.registerDevice);
app.post('/setup_mydevice',backend.setupDevice);

// app.get('/login', function (req, res) {
// var token="";
//
// var response_text="";
//
// 	resin.auth.loginWithToken(token, function(error) {
//     if (error) throw error;
// 	});
//
//
// 	resin.auth.isLoggedIn().then(function(isLoggedIn) {
//     if (isLoggedIn) {
//         console.log('I\'m in!');
//         response_text="Resin Logged in";
//
//
//
//
//        resin.models.device.getAll().then(function(devices) {
//     		console.log(devices);
// 			});
//
//
//      /*  resin.models.os.download('raspberry-pi', function(error, stream) {
//     	if (error) throw error;
//    			 stream.pipe(fs.createWriteStream('foo/bar/image.img'));
//    			//res.send(stream);
// 			});*/
//
// 		/*resin.models.device.ping('', function(error) {
//    			 if (error) throw error;
// 		});*/
//
//
//
//         res.send({"response":response_text});
//
//
//
//
//     } else {
//         console.log('Too bad!');
//
//         response_text="Resin Not Logged in";
//
//         res.send({"response":response_text});
//     }
// 	});
//
//
// });

app.get('/login', function (req, res) {

resin.auth.loginWithToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTE1NjMsInVzZXJuYW1lIjoiZ2hfanZlZGFuZyIsImVtYWlsIjoianZlZGFuZ0BnbWFpbC5jb20iLCJmaXJzdF9uYW1lIjoiVmVkYW5nIiwibGFzdF9uYW1lIjoiSmFkaGF2IiwiY29tcGFueSI6IlNhbiBKb3NlIFN0YXRlIFVuaXZlcnNpdHkiLCJzb2NpYWxfc2VydmljZV9hY2NvdW50IjpbeyJjcmVhdGVkX2F0IjoiMjAxNi0xMC0yN1QyMDozNDoxNi43MzZaIiwiaWQiOjM1MDMsInVzZXIiOnsiX19kZWZlcnJlZCI6eyJ1cmkiOiIvcmVzaW4vdXNlcigxMTU2MykifSwiX19pZCI6MTE1NjN9LCJwcm92aWRlciI6ImdpdGh1YiIsInJlbW90ZV9pZCI6IjM0MDY3MTkiLCJkaXNwbGF5X25hbWUiOiJqdmVkYW5nIiwiX19tZXRhZGF0YSI6eyJ1cmkiOiIvcmVzaW4vc29jaWFsX3NlcnZpY2VfYWNjb3VudCgzNTAzKSIsInR5cGUiOiIifX1dLCJoYXNfZGlzYWJsZWRfbmV3c2xldHRlciI6ZmFsc2UsImp3dF9zZWNyZXQiOiIzVDROTkZMRjZGVTI3S0FRWVZZUElRUzJXNkpPTlZOTSIsImhhc1Bhc3N3b3JkU2V0IjpmYWxzZSwibmVlZHNQYXNzd29yZFJlc2V0IjpmYWxzZSwicHVibGljX2tleSI6dHJ1ZSwiZmVhdHVyZXMiOltdLCJpbnRlcmNvbVVzZXJOYW1lIjoiZ2hfanZlZGFuZyIsImludGVyY29tVXNlckhhc2giOiIxZjRlY2EzZjcyMmU2OTE1MGZiOTM0MDA5NTIxMDFiMjVmZTZkNTMxYzhhNmZhYjVhNWEwOTFhMjY4OGVhYjI0IiwicGVybWlzc2lvbnMiOltdLCJhY3RvciI6MTUwNTU5LCJpYXQiOjE0Nzk1MDczNjQsImV4cCI6MTQ4MDExMjE2NH0.BAkkCaqtWeRKOd-XwYMK-HK0b2Du-MqQDKNVrZiseiY', function(error) {
    if (error) throw error;
	});


resin.auth.isLoggedIn().then(function(isLoggedIn) {
    if (isLoggedIn) {


    	resin.logs.subscribe('ca01246bdc124bbd18faf3503e9b4296b30aca1cacb6eb73499468e055979b', function(error, logs) {
    if (error) throw error;




    logs.on('line', function(line) {
        console.log(line);
    });
});
    }
});



});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
