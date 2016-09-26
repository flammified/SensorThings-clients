# NodeMCU SensorThings client using MQTT.

This is the NodeMCU firmware for a mqtt sensorthings client with node-red functioning as a middleware.
The NodeMCU sends binary data to the MQTT broker with the topic set to "binary". The Node-RED instance listens for it and parses
the binary to values. These values are then put in a SensorThings Observation and send using MQTT to the right Datastream.

This is a bit of a unnecessary step when using a NodeMCU. For me it served as an test for when I start using the LoRaWAN hardware. LoRaWAN uses tiny bits of information and thus it needs the node-red middleware used here to build a valid SensorThings request.

## Usage

Get node-red running with the node-red setup found in ```node-red-setup.txt```. Make sure the final MQTT block has the right datastream attached to it and edit the binary parser block for your specific binary format.

Then edit the right values into the firmware of the NodeMCU, like the SSID, the password and the MQTT broker information. Line 82 holds the values that are send, so you will want to edit it for your specific use-case.

Finally, just upload the firmware and you are done :)
