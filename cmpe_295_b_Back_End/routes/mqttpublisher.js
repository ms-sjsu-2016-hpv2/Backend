var express = require('express');
var app = express();

const mqtt = require('mqtt');
const client =  mqtt.connect('mqtt://iot.eclipse.org', 1883, 60);

var topic1 = 'topic/GeneralizedIoT';

client.on('connect', function () {
	console.log("Connection Successful");
	client.publish(topic1);
});

function sendStateUpdate (msg) {
  console.log('sending state %s', msg);
  client.publish('garage/state', msg);
};

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
	sendStateUpdate(message);
};

/*
 * Express
 */

app.listen(9696, function() {
  console.log('Example app listening on port 9696!');
});