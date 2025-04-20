#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <ThingSpeak.h>
#include "AdafruitIO_WiFi.h"

// WiFi credentials
#define WIFI_SSID    "Your wifi name"
#define WIFI_PASS    "it's password"

// ThingSpeak credentials
const char* apiKey = "NGAKISJ5GE4NYG3P";
const long channelID = 2922188;

// Adafruit IO credentials
#define IO_USERNAME  "your name"
#define IO_KEY       "your key"

// Adafruit IO setup
AdafruitIO_WiFi io(IO_USERNAME, IO_KEY, WIFI_SSID, WIFI_PASS);
AdafruitIO_Feed *tiltFeed = io.feed("iot-cp.tilt");
AdafruitIO_Feed *xAxisFeed = io.feed("iot-cp.x-axis");
AdafruitIO_Feed *yAxisFeed = io.feed("iot-cp.y-axis");

WiFiClient client;
Adafruit_MPU6050 mpu;

const int flexPin = A0;
const int ledPin = D4;     // GPIO2
const int buzzerPin = 12;  // D6 = GPIO12

unsigned long lastTime = 0;
float angleX = 0, angleY = 0;

void setup() {
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);

  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");

  // Initialize ThingSpeak
  ThingSpeak.begin(client);

  // Connect to Adafruit IO
  Serial.print("Connecting to Adafruit IO");
  io.connect();
  while(io.status() < AIO_CONNECTED) {
    Serial.print(".");
    delay(500);
    io.run();
  }

  Serial.println("\nConnected to Adafruit IO!");

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) { delay(1000); }
  }

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  delay(1000);
}

void loop() {
  io.run(); // keep Adafruit IO connection alive

  unsigned long currentTime = millis();
  float deltaTime = (currentTime - lastTime) / 1000.0;
  lastTime = currentTime;

  int flexValue = analogRead(flexPin);

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float gyroX = g.gyro.x * (180.0 / 3.141592);
  float gyroY = g.gyro.y * (180.0 / 3.141592);

  float accelAngleX = atan2(a.acceleration.y, a.acceleration.z) * (180.0 / 3.141592);
  float accelAngleY = atan2(-a.acceleration.x, sqrt(a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z)) * (180.0 / 3.141592);

  angleX = 0.96 * (angleX + gyroX * deltaTime) + 0.04 * accelAngleX;
  angleY = 0.96 * (angleY + gyroY * deltaTime) + 0.04 * accelAngleY;

  Serial.print("Flex: "); Serial.println(flexValue);
  Serial.print("Angle X: "); Serial.println(angleX);
  Serial.print("Angle Y: "); Serial.println(angleY);

  // LED and Buzzer Alert: beep for 3 seconds when threshold crossed
  if (flexValue > 25) {
    digitalWrite(ledPin, HIGH);
    tone(buzzerPin, 1000);     // Start beep
    delay(3000);               // Wait 3 seconds
    noTone(buzzerPin);         // Stop beep
  } else {
    digitalWrite(ledPin, LOW);
    noTone(buzzerPin);         // Make sure buzzer is off
  }

  // Send to ThingSpeak
  ThingSpeak.setField(1, flexValue);
  ThingSpeak.setField(2, angleX);
  ThingSpeak.setField(3, angleY);
  int status = ThingSpeak.writeFields(channelID, apiKey);

  if (status == 200) {
    Serial.println("Data sent to ThingSpeak");
  } else {
    Serial.print("ThingSpeak error: ");
    Serial.println(status);
  }

  // Send to Adafruit IO
  tiltFeed->save(flexValue);
  xAxisFeed->save(angleX);
  yAxisFeed->save(angleY);

  Serial.println("Data sent to Adafruit IO\n");

  delay(15000); // ThingSpeak minimum interval
}
