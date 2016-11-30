var express = require('express');
var app = express();

const mqtt = require('mqtt');
const client =  mqtt.connect('mqtt://iot.eclipse.org', 1883, 60);

var iotState = '';
var connected = false;

var topic1 = 'topic/GeneralizedIoT';
var topic2 = '';

client.on('connect', function () {
	console.log("Connection Successful");
	client.subscribe(topic1);
	client.subscribe(topic2);
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
}

function handleTopic2 (message) {
	console.log('%s', message);
}

/*
 * Express
 */

app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
