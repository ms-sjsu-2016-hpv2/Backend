var express = require('express');
var router = express.Router();
var request = require('request');
var contants=require('./app_constants');
var resin = require("resin-sdk");
var cmd = require("node-cmd");

router.get('/start', function(req, res, next) {

  console.log("Directory name is"+__dirname);




request(
    {
        url : 'https://api.resin.io/v1/device',
        headers : {
        	"Content-Type" : 'application/json',
            "Authorization" : 'Bearer '+contants.TOKEN
        },
        json: true,
    },
    function (error, response, body) {
        // Do more stuff with 'body' here


      //console.log(body.d);
        res.render('start', { title: 'IOT Dashboard', device_list:body.d});
    }
);






 
});


router.get('/register_device', function(req, res, next) {

res.render('register_device');

});


router.get('/setup_device/:device_id', function(req, res, next) {


request(
    {
        url : 'https://api.resin.io/resin/device('+req.params.device_id+')',
        headers : {
        	"Content-Type" : 'application/json',
            "Authorization" : 'Bearer '+contants.TOKEN
        },
        json: true,
    },
    function (error, response, body) {
        // Do more stuff with 'body' here


        /*resin.logs.subscribe(body.d[0].uuid, function(error, logs) {  
            if (error) throw error;

            logs.on('line', function(line) {
                console.log(line);
            });
        });*/


      //console.log(body.d);
        res.render('setup_device', { title: 'IOT Dashboard', device_details:body.d[0]});
    }
);







});



router.get('/get_device_logs', function(req, res, next) {



});


router.get('/app_login', function(req, res, next) {

res.render('login');

});

router.get('/charts', function(req, res, next) {

res.render('display_device_data');

});


router.get('/start_deployment/:device_uuid', function(req, res, next) {

var device_object=new Object();

//device_object.name=req.params.device_name;
device_object.uuid=req.params.device_uuid;

//res.render('deploy_app');
res.render('deploy_app',{device_object:device_object});

});






router.post('/validate_user', function(req, res, next) {

    

    var user_name=req.body.user_name;
    var user_password=req.body.user_password;

    if(user_name.trim()=="abc" && user_password.trim()=="abc"){


    res.redirect('/start');

    }else{

        res.render('login');
    }



});


router.post('/deploy_mydevice', function(req, res, next) {

    var device_uuid_h=req.body.device_uuid_h;
    var sensor_type=req.body.sensor_type;

    //this should be the application id from the UI,
    //if that is not possible we will have to fetch it from the database
    // var resioIO = application_id;
    //if you get an error here stating Javascript not supported format
    //go to Webstorm -> Preferences -> Language and Frameworks
    // -> JavaScript -> in JavaScript version language select -> ECMAScript6
    //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+application_id+`.git

    //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/pi2temperature.git
    //var device_uuid = "ca01246bdc124bbd18faf3503e9b4296b30aca1cacb6eb73499468e055979b";

    if(sensor_type == "Temperature") {
        console.log(device_uuid_h+" is the UUID");
        //  res.send("{messsage:"+device_uuid+"}");
        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
            console.log(`This is vedang `+applicationName+` with this id`);
            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
            //https://github.com/jvedang/IoTRaspberryPi.git
            cmd.get(
                `
            git clone https://github.com/ms-sjsu-2016-hpv2/IoT.git
            cd IoT
            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
            git push resin master --force
            git remote remove resin
        `,
                function(data){
                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                    //res.send("{status_code:200, message:\"Application published on the device\"}");
                    res.render('display_device_data');
                }
            );
        });

        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
    }
});




module.exports = router;
