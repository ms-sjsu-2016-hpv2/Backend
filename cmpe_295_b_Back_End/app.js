var http = require('http');

var resin = require('resin-sdk');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'name it', cookie: { maxAge: 600000}}));




var backend = require('./routes/backend');
var routes = require('./routes/index');
app.use('/', routes);


app.post('/register_mydevice', backend.registerDevice);
app.post('/setup_mydevice',backend.setupDevice);

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
