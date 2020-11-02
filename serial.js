// TODO :: add a text box to send commands, button to send data, button to close port, button to open port
var serial; // variable to hold an instance of the serialport library

var inData;

function setupSerial() {
    serial = new p5.SerialPort(); // make a new instance of the serialport library
    serial.on('list', printList); // set a callback function for the serialport list event
    serial.list(); // list the serial ports
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen); // callback for the port opening
    serial.on('data', serialEvent); // callback for when new data arrives
    serial.on('error', serialError); // callback for errors
    serial.on('close', portClose); // callback for the port closing

    serial.clear();

    let portName = document.getElementById("comPort").value;
    let options = { baudRate: parseInt(document.getElementById("baudRate").value) }; // change the data rate to whatever you wish

    document.getElementById("serialStatus").innerHTML = "Connecting...";
    serial.open(portName, options); // open a serial port

}

function getCommand() {
    let command = document.getElementById("commandText").value;
    document.getElementById("commandText").value = "<,>";
    sendToArduino(command);
}

function sendToArduino(data) {
    serial.write(data);
}


// callback functions
function serverConnected() {
    print('connected to server.');
}

function portOpen() {
    print('the serial port opened.')
}

// recieving data from arduino
function serialEvent() {
    inData = serial.readLine();
    if (inData.length > 0) {
        print("recieved from arduino:" + inData);
        print("updating map");

        let parsed;

        try {
            parsed = JSON.parse(inData)
            updateMap(parsed);
            updateButtons(parsed);
            document.getElementById("serialStatus").innerHTML = "Recieved Data";
        } catch (e) {
            console.log("parsing failed from serial");
        }
    }
}

function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
}

function portClose() {
    print('The serial port closed.');
}

function printList(portList) {
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
        // Display the list the console:
        console.log(i + " " + portList[i]);
    }
}

function updateButtons(locations) {
    document.getElementById("markers").innerHTML = "";

    for (let i = 0; i < locations.length; i++) {
        var button = document.createElement("button");
        button.innerHTML = locations[i].name;

        // 2. Append somewhere
        var html = document.getElementById("markers");
        html.appendChild(button);

        // 3. Add event handler
        button.addEventListener("click", function() {
            moveMapTo(locations[i].name);
        });
    }

}