const spinalCore = require('spinal-core-connectorjs');
const models = require('../spinal-model-button/model.js');
 
// 2
 
process.env.SPINALHUB_PORT = 7777;
process.env.SPINALHUB_IP = "127.0.0.1";
process.env.SPINAL_USER_ID = 168;
process.env.SPINAL_PASSWORD = "SPINAL_PASSWORD"; // you will find it in th file .config.json  (spinalcom connection configuration file)
 
const conn = spinalCore.connect(`http://${process.env.SPINAL_USER_ID}:${process.env.SPINAL_PASSWORD}@${process.env.SPINALHUB_IP}:${process.env.SPINALHUB_PORT}/`);
 
// 3: Create and store button
spinalCore.load(conn, "myButton",
  function (myButton) { //success callback
    console.log('load & sync existing model if it exists');
    press(myButton);
  },
  function (myButton) { //error callback
    myButton = new models.ButtonModel();
    spinalCore.store(conn, myButton, "myButton", function () {
      console.log('store & sync new model, first connection');
      press(myButton);
    });
  }
);
 
// 4:  Simulate that a button is being pressed
function press(button) {
  // Toggle pressed
  button.pressed.set(!button.pressed.get());
  // Call the function every second
  setTimeout(function () {
    console.log("button has been pressed");
    press(button);
  }, 1000);
}