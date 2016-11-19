/**
 * Created by stealz on 11/16/16.
 */

var cmd = require("node-cmd");
var mysql = require("./mysql");
var resin = require("resin-sdk");
var app_constants = require('./app_constants');
var application_id = "";

exports.registerDevice = function(req, res) {

    var device_name = req.body.device_name;;
    var device_vendor = req.body.device_vendor;
    var sensor_type = req.body.sensor_type;
    device_name = device_name.replace(/ /g, "");
    device_vendor = device_vendor.replace(/ /g, "");
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
                        application_id = results[0].application_id;
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
                        application_id = device_name+"_"+device_vendor;
                        var user_id = results[0].user_id;

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
                                                        "" +user_id+", '"+application_id+"', '"+device_vendor+"', '"+uuid+
                                                        "');"

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
    // var resioIO = application_id;
    //if you get an error here stating Javascript not supported format
    //go to Webstorm -> Preferences -> Language and Frameworks
    // -> JavaScript -> in JavaScript version language select -> ECMAScript6
    //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/`+application_id+`.git

    //git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/pi2temperature.git
    var device_uuid = "ca01246bdc124bbd18faf3503e9b4296b30aca1cacb6eb73499468e055979b";
    console.log(device_uuid+" is the UUID");
  //  res.send("{messsage:"+device_uuid+"}");
    resin.models.device.getApplicationName(device_uuid).then(function(applicationName) {
        console.log(applicationName);
        cmd.get(
            `
            git clone https://github.com/jvedang/IoTRaspberryPi.git
            cd IoTRaspberryPi
            git remote add resin gh_jvedang@git.resin.io:gh_gandhihardikm/pi2temperature.git
            git push resin master --force
            git remote remove resin
        `,
            function(data){
                console.log('the node-cmd cloned dir contains these files :\n\n',data);
                res.send("{status_code:200, message:\"Application published on the device\"}");
            }
        );
    });
}