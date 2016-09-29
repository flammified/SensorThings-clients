

#include <rn2483.h>
#include <SoftwareSerial.h>
#include <dht11.h>

#define DHT11PIN 3

dht11 DHT11;

union {
    float fval;
    byte bval[4];
} floatAsBytes;


SoftwareSerial radio_serial(5, 6); // RX, TX

char AppEUI[] = "";
char AppKey[] = "";

rn2483 myLora(radio_serial);

// the setup routine runs once when you press reset:
void setup()
{
  // Open serial communications and wait for port to open:
  Serial.begin(57600); //serial port to computer
  radio_serial.begin(9600); //serial port to radio
  Serial.println("Startup");

  initialize_radio();

  delay(2000);
}

void initialize_radio()
{
  //reset rn2483
  pinMode(12, OUTPUT);
  digitalWrite(12, LOW);
  delay(500);
  digitalWrite(12, HIGH);

  //Autobaud the rn2483 module to 9600. The default would otherwise be 57600.
  myLora.autobaud();
  //print out the HWEUI so that we can register it via ttnctl
  Serial.println("When using OTAA, register this DevEUI: ");
  Serial.println(myLora.hweui());
  Serial.println("RN2483 firmware version:");
  Serial.println(myLora.sysver());

  //configure your keys and join the network
  Serial.println("Trying to join TTN");
  bool join_result = false;

  //ABP: initABP(String addr, String AppSKey, String NwkSKey);
  //join_result = myLora.initABP("", "", "");

  //OTAA: initOTAA(String AppEUI, String AppKey);
  join_result = myLora.initOTAA(AppEUI, AppKey);

  while(!join_result)
  {
    Serial.println("Unable to join. Are your keys correct, and do you have TTN coverage?");
    delay(60000); //delay a minute before retry
    join_result = myLora.initOTAA(AppEUI, AppKey);
  }
  Serial.println("Successfully joined TTN");
}

// the loop routine runs over and over again forever:
void loop()
{
  int chk = DHT11.read(DHT11PIN);
  Serial.println(chk);
    switch (chk)
  {
    case DHTLIB_OK:
      Serial.println("OK");
      break;
    case DHTLIB_ERROR_CHECKSUM:
      Serial.println("Checksum error");
      break;
    case DHTLIB_ERROR_TIMEOUT:
      Serial.println("Time out error");
      break;
    default:
      Serial.println("Unknown error");
      break;
  }

  Serial.print("Temperature (°C): ");
  Serial.println((float)DHT11.temperature, 2);

  char result[8];
  floatAsBytes.fval = (float)DHT11.temperature;
  sprintf(result, "%02x%02x%02x%02x", floatAsBytes.bval[0], floatAsBytes.bval[1], floatAsBytes.bval[2], floatAsBytes.bval[3]);
  String temperature = String(result);
  Serial.println(temperature);
  //delay((long)173 * 1000);

  Serial.println(myLora.txData(temperature, false));
  Serial.println("DONE");

  delay((long)173 * 1000);
}
