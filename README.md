

This is solely for the Argonia cup, and as such, no other tiles are downloaded. Download more tiles from Atlas

SETUP:
======

For the Arduino:
1. If its not already installed, install the IDE for arduino
2. Plug in your Arduino
3. open and upload the one arduino file in arduino/sendRandomCords folder through the IDE

If you wish to send data between the Arduino and website, it must conform to this format:
	From Arduino to server must be parsed in JSON format, an array, where each entry has a "name", "lon", and "lat". there is an example in the file provided
	From server to Arduino must be in the format <command, value>, with the brakets included.

For the server:
1. If it is not already installed, install node.js
2. navigate to the folder containing this README through the command line
3. start listening for serial input by running
    node p5.serialport-master\startserver.js
   then you should see conformation its listening
4. Open the Index.html file in this folder
5. If there are issues, open the console in your browser
