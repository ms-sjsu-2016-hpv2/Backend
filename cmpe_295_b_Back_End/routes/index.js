var express = require('express');
var router = express.Router();
var request = require('request');
var contants=require('./app_constants');
var resin = require("resin-sdk");
var cmd = require("node-cmd");
var cors = require('cors');
const mqtt = require('mqtt');
var app_constants = require('./app_constants');


router.get('/start', function(req, res, next) {

    request(
        {
            url : 'https://api.resin.io/v1/device',
            headers : {
            	"Content-Type" : 'application/json',
                "Authorization" : 'Bearer '+req.session.user_token
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
                    "Authorization" : 'Bearer '+req.session.user_token
                },
                json: true,
            },
            function (error, response, body) {
            
                req.session.device_details=body.d[0];      
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
 
//console.log("ID is "+req.session.device_details.id);

var device_object=new Object();
//device_object.uuid=req.params.device_uuid;
res.render('deploy_app',{device_object:req.session.device_details});

});






router.post('/validate_user', function(req, res, next) {

    var user_name=req.body.user_name;
    var user_password=req.body.user_password;
    var user_token=req.body.user_token;

    if(user_name.trim()=="abc" && user_password.trim()=="abc"){

    req.session.username="abc";
    req.session.user_token=user_token;

    resin.auth.loginWithToken(user_token, function(error) {
        if (error) throw error;
    });

     resin.auth.isLoggedIn(function(error, isLoggedIn) {
        if (isLoggedIn) {

            req.session.resin=resin;
        }else{

        res.render('login');

        }
     });

    res.redirect('/start');

    }else{

        res.render('login');
    }

});


router.post('/deploy_mydevice', function(req, res, next) {

    var device_uuid_h=req.body.device_uuid_h;
    var sensor_type=req.body.sensor_type;


    resin=req.session.resin;


    resin.auth.isLoggedIn(function(error, isLoggedIn) {
        if (error) throw error;


            if (isLoggedIn) {

                    if(sensor_type == "Temperature" && req.session.device_details.device_type=='raspberry-pi2') {
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
                                    res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'temperature'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }


                    if(sensor_type == "Light" && req.session.device_details.device_type=='intel-edison') {
                        console.log(device_uuid_h+" is the UUID");
                        //  res.send("{messsage:"+device_uuid+"}");
                        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
                            console.log(`This is vedang `+applicationName+` with this id`);
                            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
                            //https://github.com/jvedang/IoTRaspberryPi.git
                            cmd.get(
                                `
                            git clone https://github.com/pankajdighe/intel_edison_light_dummy_application.git
                            cd intel_edison_light_dummy_application
                            //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
                            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/edisonapps.git
                            git push resin master --force
                            git remote remove resin
                        `,
                                function(data){
                                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                                   // res.send("{status_code:200, message:\"Application published on the device\"}");
                                   res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'light'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }


                    if(sensor_type == "Temperature" && req.session.device_details.device_type=='intel-edison') {
                        console.log(device_uuid_h+" is the UUID");
                        //  res.send("{messsage:"+device_uuid+"}");
                        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
                            console.log(`This is vedang `+applicationName+` with this id`);
                            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
                            //https://github.com/jvedang/IoTRaspberryPi.git
                            cmd.get(
                                `
                            git clone https://github.com/pankajdighe/intel_edison_temperature_dummy_application.git
                            cd intel_edison_temperature_dummy_application
                            //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
                            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/edisonapps.git
                            git push resin master --force
                            git remote remove resin
                        `,
                                function(data){
                                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                                   // res.send("{status_code:200, message:\"Application published on the device\"}");
                                   res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'temperature'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }


                    if(sensor_type == "Motion" && req.session.device_details.device_type=='intel-edison') {
                        console.log(device_uuid_h+" is the UUID");
                        //  res.send("{messsage:"+device_uuid+"}");
                        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
                            console.log(`This is vedang `+applicationName+` with this id`);
                            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
                            //https://github.com/jvedang/IoTRaspberryPi.git
                            cmd.get(
                                `
                            git clone https://github.com/pankajdighe/intel_edison_motion_dummy_application.git
                            cd intel_edison_motion_dummy_application
                            //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
                            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/edisonapps.git
                            git push resin master --force
                            git remote remove resin
                        `,
                                function(data){
                                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                                   // res.send("{status_code:200, message:\"Application published on the device\"}");
                                   res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'motion'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }


                     if(sensor_type == "Sound" && req.session.device_details.device_type=='intel-edison') {
                        console.log(device_uuid_h+" is the UUID");
                        //  res.send("{messsage:"+device_uuid+"}");
                        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
                            console.log(`This is vedang `+applicationName+` with this id`);
                            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
                            //https://github.com/jvedang/IoTRaspberryPi.git
                            cmd.get(
                                `
                            git clone https://github.com/pankajdighe/intel_edison_sound_dummy_application.git
                            cd intel_edison_sound_dummy_application
                            //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
                            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/edisonapps.git
                            git push resin master --force
                            git remote remove resin
                        `,
                                function(data){
                                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                                   // res.send("{status_code:200, message:\"Application published on the device\"}");
                                   res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'sound'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }

                        if(sensor_type == "Pollutant" && req.session.device_details.device_type=='intel-edison') {
                        console.log(device_uuid_h+" is the UUID");
                        //  res.send("{messsage:"+device_uuid+"}");
                        resin.models.device.getApplicationName(device_uuid_h).then(function(applicationName) {
                            console.log(`This is vedang `+applicationName+` with this id`);
                            //https://github.com/ms-sjsu-2016-hpv2/IoT.git
                            //https://github.com/jvedang/IoTRaspberryPi.git
                            cmd.get(
                                `
                            git clone https://github.com/pankajdighe/intel_edison_pollutant_dummy_application.git
                            cd intel_edison_pollutant_dummy_application
                            //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+applicationName+`.git
                            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/edisonapps.git
                            git push resin master --force
                            git remote remove resin
                        `,
                                function(data){
                                    console.log('the node-cmd cloned dir contains these files :\n\n',data);
                                   // res.send("{status_code:200, message:\"Application published on the device\"}");
                                   res.render('display_device_data',{device_uuid:device_uuid_h,device_sensor:'pollutants'});
                                }
                            );
                        });

                        console.log("Device ID "+device_uuid_h+" Sensor Type "+sensor_type);
                    }




                }
            });


});



router.get('/subscribe/:device_sensor', function(req, res){

res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });


const client =  mqtt.connect('mqtt://iot.eclipse.org', 1883, 60);

var iotState = '';
var connected = false;

var device_sensor=req.params.device_sensor
var topic1 = 'topic/GeneralizedIoT/'+device_sensor;
var topic2 = '';

client.on('connect', function () {
    console.log("Connection Successful");
    client.subscribe(topic1);
   // client.subscribe(topic2);
});

client.on('message', function(topic, message) {
    switch (topic) {
        case topic1:
            return handleTopic1(message);
        case topic2:
            return handleTopic2(message);
    }
    console.log('No Handler for topic %s', topic);
});

function handleTopic1 (message) {
    console.log('%s', message);
    res.write('data: ' + message + "\n\n");
}

function handleTopic2 (message) {
    console.log('%s', message);
}


});


router.get('/getDeviceLogs/:device_uuid', function(req, res){ 

res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });


resin=req.session.resin;


    resin.auth.isLoggedIn(function(error, isLoggedIn) {
        if (error) throw error;


            if (isLoggedIn) {

                console.log("connected to resin io");
                resin.logs.subscribe(req.params.device_uuid, function(error, logs) {
                    if (error) throw error;

                    logs.on('line', function(line) {
                         console.log(line);
                        res.write('data: ' + line.message + "\n\n");
                       
                    });
                });


            }

        });

});


router.get('/viewDeviceLogs/:device_uuid', function(req, res){ 


res.render('display_device_data',{device_uuid:req.params.device_uuid});

});




module.exports = router;
