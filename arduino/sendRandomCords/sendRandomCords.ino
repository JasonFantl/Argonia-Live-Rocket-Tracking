// code is from https://forum.arduino.cc/index.php?topic=288234.0

// "format for sending data must be
// <command, commandValue>
// with the brackets included. command is a string and commandValue a float

// data reading vars
const byte numChars = 32;
char receivedChars[numChars];
boolean newData = false;

char command[numChars] = {0};
float commandValue;

int timer;

void setup() {
  Serial.begin(9600); // Starts the serial communication
  timer = millis();

  pinMode(LED_BUILTIN, OUTPUT);
}
void loop() {

  // first read any incoming data and parse iit
  recvWithStartEndMarkers();
  if (newData == true) {
    newData = false;
    parseData();

    // do something with recieved command and value
    if (strcmp(command, "change LED") == 0) {
      if (commandValue == 1) {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("set to high");
      }
      else if (commandValue == 0) {
        digitalWrite(LED_BUILTIN, LOW);
        Serial.println("set to low");
      }
    }
  }

  // then send out data if enough time has elapsed since the last message
  int now = millis();
  if ((now - timer) / 1000 > 3) {
    timer = now;
    String randLat1 = "37.17" + String(random(1000000));
    String randLng1 = "-97.74" + String(random(1000000));
    String randLat2 = "37.17" + String(random(1000000));
    String randLng2 = "-97.74" + String(random(1000000));

    Serial.println("[{\"name\":\"rocket\",\"lat\":" + randLat1 + ",\"lon\":" + randLng1 + "},{\"name\":\"pocket\",\"lat\":" + randLat2 + ",\"lon\":" + randLng2 + "}]");
  }
}




void recvWithStartEndMarkers() {
  static boolean recvInProgress = false;
  static byte ndx = 0;
  char startMarker = '<';
  char endMarker = '>';
  char rc;

  // if (Serial.available() > 0) {
  while (Serial.available() > 0 && newData == false) {
    rc = Serial.read();

    if (recvInProgress == true) {
      if (rc != endMarker) {
        receivedChars[ndx] = rc;
        ndx++;
        if (ndx >= numChars) {
          ndx = numChars - 1;
        }
      }
      else {
        receivedChars[ndx] = '\0'; // terminate the string
        recvInProgress = false;
        ndx = 0;
        newData = true;
      }
    }

    else if (rc == startMarker) {
      recvInProgress = true;
    }
  }
}

void parseData() {
  char * strtokIndx; // this is used by strtok() as an index

  strtokIndx = strtok(receivedChars, ",");     // get the first part - the string
  strcpy(command, strtokIndx); // copy it to messageFromPC

  strtokIndx = strtok(NULL, ",");
  commandValue = atof(strtokIndx);     // convert this part to a float

}
