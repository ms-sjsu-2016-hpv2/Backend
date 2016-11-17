/**
 * Created by stealz on 11/16/16.
 */

var cmd = require("node-cmd");
var mysql = require("./mysql");
var resin = require("resin-sdk");
var app_constants = require('./app_constants');

exports.registerDevice = function(req, res) {

    var device_name = req.param['device_name'];
    var device_vendor = req.param['device_vendor'];
    var sensor_type = req.param['sensor_type'];
    var email_address = "vedrocks81@gmail.com";

    resin.auth.loginWithToken(app_constants.TOKEN, function(error) {
        if (error) throw error;
    });

    resin.auth.isLoggedIn(function(error, isLoggedIn) {
        if (error) throw error;

        if (isLoggedIn) {
            var query = "select application_id, user_id from users where email_address='"+email_address+"';";
            mysql.fetchData(function(err, results) {
                if(err) {
                    throw err;
                } else {
                    if(results.length > 0 && results[0].application_id != '') {

                        //Application has already been created, we need to add a new device to it now
                        var application_id = results[0].application_id;
                        var user_id = results[0].user_id;

                            //the application id has been retrieved, now create the device
                            var device_id = device_name+"_"+device_vendor;

                            resin.models.device.generateUUID(function(err, uuid) {
                                if(err) {
                                    throw err;
                                } else {
                                    resin.models.device.register(application_id, uuid, function (err, device) {
                                        if(err) {
                                            throw err;
                                        } else {
                                            //device has been created here now.
                                            res.send("{status_code:200, message: \"device has been created successfully\"}");
                                        }
                                    });
                                }
                            })

                    } else {

                        //Create application and then add the device to it.
                        var application_id = device_name+"_"+device_vendor+"_"+sensor_type;

                        resin.models.application.create(application_id,'raspberry-pi')
                            .then(function(err, application){

                                console.log("Application has been created with "+application_id+" name");

                                var updateQuery = "update users set application_id='"+application_id+"' where" +
                                    " email_address='"+email_address+"';";

                                //adding the application_id to the database
                                mysql.insertData(function(err, results) {

                                    if(err) {
                                        throw err;
                                    } else {
                                        if(results.affectedRows > 0) {

                                            //the application id has been inserted, now create the device
                                            var device_id = device_name+"_"+device_vendor+Math.floor(Date.now()/1000);

                                            resin.models.device.generateUUID(function(err, uuid) {
                                                // if(err) {
                                                //     throw err;
                                                // } else {
                                                resin.models.device.register(application_id, uuid, function (err, device) {

                                                    var insertQuery = "insert into user_devices(user_id, device_name, device_vendor, device_id)" +
                                                        " values(" +
                                                        "" +user_id+", testing_app, raspberry_pi, "+uuid+
                                                        ");"

                                                    mysql.insertData(function(err, results){
                                                        if(err) {
                                                            throw err;
                                                        } else {

                                                            if(results.affectedRows > 0) {

                                                                //device has been created here now.
                                                                res.send("{status_code:200, message: \"device has been created successfully\"}");
                                                            } else {
                                                                res.send("{status_code:401, message:\"Bad Authentication for Resin IO\"");
                                                            }
                                                        }
                                                    },insertQuery);


                                                });
                                                //}
                                            })
                                        } else {
                                            //application id failed to insert. Now return the response as failed
                                            res.send("{status_code:400}");
                                        }
                                    }
                                }, updateQuery);


                            });

                    }
                }

            },query);

        } else {
            res.send("{status_code:401, message:\"Bad Authentication for Resin IO\"");
            console.log('Too bad!');
        }
    });
}

exports.setupDevice = function(req, res) {

    //this should be the application id from the UI,
    //if that is not possible we will have to fetch it from the database
    var resioIO = req.param['application_id'];
    //if you get an error here stating Javascript not supported format
    //go to Webstorm -> Preferences -> Language and Frameworks
    // -> JavaScript -> in JavaScript version language select -> ECMAScript6
    cmd.get(
        `
            git clone https://github.com/jvedang/IoTRaspberryPi.git
            cd IoTRaspberryPi
            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+resinIO+`.git
            git push resin master --force
            git remote remove resin
        `,
        function(data){
            console.log('the node-cmd cloned dir contains these files :\n\n',data)
            res.send("{status_code:200, message:\"Application published on the device\"}");
        }
    );
}