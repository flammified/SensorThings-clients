var request = require('request');
var os = require('os');
var moment = require('moment');
var async = require('async');

function post_observations(id) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/Observations',
            method: 'POST',
            json: {
                "phenomenonTime": moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                "resultTime" : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
                "result" : os.loadavg()[0],
                "Datastream":{"@iot.id":id}
            }
        },
        function(error, response, body) {
            if (error) {
                console.log(error);
                process.exit(1);
            }
        }
    );

    setTimeout(function() {
        post_observations(id);
    }, 3000);
}

function createThingAndGetId(callback) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/Things',
            method: 'POST',
            json: {
                "name": "PC",
                "description": "My computer"
            }
        },
        function(error, response, body) {
            if (error) {
                callback(error);
            } else {
                console.log("Got thing id! Id: " + body["@iot.id"]);
                callback(null, body["@iot.id"]);
            }
        }
    );
}

function createLocationAndGetId(thing_id, callback) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/Things(' + thing_id + ')/Locations',
            method: 'POST',
            json: {
                "encodingType": "application/vnd.geo+json",
                "name": "PC Location",
                "description": "Location of my pc",
                "location": {
                	"type": "Feature",
                	"properties":{},
                    	"type": "Point",
                    	"coordinates": [5.13, 52.13]

                }
            }
        },
        function(error, response, body) {
            if (error) {
                callback(error);
            } else {
                console.log("Got Location id! Id: " + body["@iot.id"]);
                callback(null, thing_id);
            }
        }
    );
}


function createSensorAndGetId(thing_id, callback) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/Sensors',
            method: 'POST',
            json: {
                "name": "PC",
                "description": "CPU usage sensor",
                "encodingType": "http://schema.org/description",
                "metadata": "No relevant metadata"
            }
        },
        function(error, response, body) {
            if (error) {
                callback(error);
            } else {
                console.log("Got sensor id! Id: " + body["@iot.id"]);
                sensor_id = body["@iot.id"];
                callback(null, thing_id, sensor_id);
            }
        }
    );
}


function createObservedPropertyAndGetId(thing_id, sensor_id, callback) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/ObservedProperties',
            method: 'POST',
            json: {
                "name": "CPU usage",
                "description": "http://schema.org/description",
                "definition": "CPU usage at the given moment"
            }
        },
        function(error, response, body) {
            console.log(body)
            if (error) {
                callback(error);
            } else {
                console.log("Got observedproperty id! Id: " + body["@iot.id"]);
                op_id = body["@iot.id"];
                callback(null, thing_id, sensor_id, op_id);
            }
        }
    );
}


function createDatastreamPropertyAndGetId(thing_id, sensor_id, op_id, callback) {
    request(
        {
            url: 'http://127.0.0.1:8080/v1.0/Datastreams',
            method: 'POST',
            json: {
                "name":"CPU Usage of Alexanders laptop",
                "unitOfMeasurement": {
                    "symbol": "%",
                    "name": "Percentage",
                    "definition": "http://www.qudt.org/qudt/owl/1.0.0/unit/Instances.html"
                },
                "observationType":"http://www.opengis.net/def/observationType/OGC-OM/2.0/OM_Measurement",
                "description": "CPU Usage",
                "Thing": {"@iot.id": thing_id},
                "ObservedProperty": {"@iot.id": op_id},
                "Sensor": {"@iot.id": sensor_id}
            }
        },
        function(error, response, body) {
            if (error) {
                callback(error);
            } else {
                console.log("Got datastream id! Id: " + body["@iot.id"]);
                datastream_id = body["@iot.id"];
                callback(null, datastream_id);
            }
        }
    );
}



async.waterfall([
    createThingAndGetId,
    createLocationAndGetId,
    createSensorAndGetId,
    createObservedPropertyAndGetId,
    createDatastreamPropertyAndGetId
], function (err, result) {
    if (err) {
        console.log(err);
        return;
    }
    post_observations(result);
});
