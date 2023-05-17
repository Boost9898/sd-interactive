// ************************************************** \\
// // DISPLAY CLIENT SCRIPT FOR SOCKET.IO SERVER
// ************************************************** \\
console.log('display.js')

let clientId = 'unknown',
  debugMode = false;

// Socket: receive initial data */
socket.on('initialData', function (data) {
  clientId = data.clientId;
  // window.location.hash = clientId;
});

// Socket: receive single update
socket.on('update', function (data) {
  if (debugMode != data.debugMode) {
    debugMode = data.debugMode;
  }
});

// Socket: identify
socket.emit('identify', { type: clientType });

socket.on('send_test_data', function (data) {
  console.log('Received data from server:', data);
  const container = document.getElementById('test-container');
  const count = container.childElementCount + 1;
  const newDiv = document.createElement('div');
  newDiv.textContent = `${data.state_names[data.state]} ${count}`;
  container.appendChild(newDiv);
});

socket.on('data_delete', function () {
  let testContainer = document.getElementById("test-container");
  testContainer.removeChild(testContainer.lastChild);
});

socket.on('display_language_switch', function (data) {
  const setLanguageElement = document.getElementById('set-language');
  setLanguageElement.textContent = `Language set to: ${data} `;
});




// ************************************************** \\
// IMPORTS
// ************************************************** \\
// import { toggleGenerateButton } from './touchscreen/toggleGenerateButton.js';
// import { fadeIn, fadeOut } from './touchscreen/fades.js';
// import { randomPrompt } from './touchscreen/random-prompt.js';
// import { showModels } from './touchscreen/show-models.js';