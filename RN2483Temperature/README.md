# RN2483 Temperature SensorThings client

This is a client that sends the current temperature, aquired by a DHT11, to a SensorThings enabled server over LoRaWAN using a RN2483 LoRa modem. It also uses a Node-Red instance as middleware.

# Usage

Edit the correct  Appkey and APPEUI into the ino file and upload it to an Arduino with a RN2483 connected to it. The DHT11 pin can be configured in the ino file and the rx/tx of the RN2483 are pins 5 and 6. The RN2483 also uses pin 12 as the reset pin.

Afterwards start node-red and import the setup found in ```node-red-setup.txt``` as well. Make sure that you edit the right username, password and topic into both MQTT nodes.

# Libaries used

This client uses [the DHT11 library from the arduino site](http://playground.arduino.cc/Main/DHT11Lib) and [the RN2483 library, written by jpmeijers](https://github.com/jpmeijers/RN2483-Arduino-Library).
