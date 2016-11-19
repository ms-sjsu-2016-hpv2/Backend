const mqtt = require('mqtt')
const client =  mqtt.connect('iot.eclipse.org', 1883, 60)

var iotState = ''
var connected = false

var topic1 = ''
var topic2 = ''

client.on('connect' () => {
	client.subscribe(topic1)
	client.subscribe(topic2)
})

client.on('message', (topic, message) => {
	switch (topic) {
		case topic1:
			return handleTopic1(message)
		case topic2:
			return handleTopic2(message)
	}
	console.log('No Handler for topic %s', topic)
})

function handleTopic1 (message) {
	console.log('%s', message)
}

function handleTopic2 (message) {
	console.log('%s', message)
}