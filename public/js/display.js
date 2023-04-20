// ************************************************** \\
// TOUCHSCREEN CLIENT SCRIPT FOR SOCKET.IO SERVER
// ************************************************** \\
console.log('display.js')

let clientId = 'unknown',
  debugMode = false;

/* Socket: receive initial data */
socket.on('initialData', function (data) {
  clientId = data.clientId;
  // window.location.hash = clientId;
});

/* Socket: receive single update */
socket.on('update', function (data) {

  if (debugMode != data.debugMode) { debugMode = data.debugMode; }
});

/* Socket: identify */
socket.emit('identify', { type: clientType });

// ************************************************** \\
// IMPORTS
// ************************************************** \\
// import { toggleGenerateButton } from './touchscreen/toggleGenerateButton.js';
// import { fadeIn, fadeOut } from './touchscreen/fades.js';
// import { randomPrompt } from './touchscreen/random-prompt.js';
// import { showModels } from './touchscreen/show-models.js';