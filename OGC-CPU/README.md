# CPU-OGC

A small OGC SensorThings client that logs CPU usage. It creates a Thing, a Location, a Sensor, an ObservedPropery and a Datastream using the API calls.
This only works on unix environments, as os.loadavg() always returns [0,0,0] on Windows systems.

## Usage

Make sure you have a OGC SensorThings capable server running on port 8080 on localhost.
Then just run ```nodejs index.js```.
