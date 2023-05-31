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

// 
// SOCKET IDENTIFY
//
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

// DEV TODO: testing purpose
socket.on('display_language_switch', function (data) {
  const setLanguageElement = document.getElementById('set-language');
  setLanguageElement.textContent = `Language set to: ${data} `;
});


// 
// RECEIVING AND SHOWING IMAGES
//
socket.on('photo_data_url', function (photoDataUrl) {
  console.log(1);
  console.log(photoDataUrl);
  displayBase64Image(photoDataUrl);
})

socket.on('generated_image', function (photoData) {
  console.log(2);
  console.log(photoData.photoData);
  displayBase64Image(photoData.photoData);
})

function displayBase64Image(base64String) {
  const image = new Image();

  // make sure base64 string has correct format
  if (base64String.startsWith('data:image/png;base64,')) {
    image.src = base64String;
  } else {
    image.src = `data:image/png;base64,${base64String}`;
  }
  image.id = 'generated-image';
  document.body.appendChild(image);
}

//
// DELETE GENERATED IMAGE
//
socket.on('delete_generated_image', function (data) {
  if (data === true) {
    // document.getElementById('generated-image').remove();
    const generatedImages = document.querySelectorAll('#generated-image');
    generatedImages.forEach(image => {
      image.remove();
    });
  }
})


// 
// RECEIVING AND SHOWING MARKER DATA
//
socket.on('marker_data', function (markerData) {
  const container = document.getElementById('marker-data-container');
  container.innerHTML = ''; // Clear previous data

  Object.entries(markerData.marker).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);

    const dataElement = document.createElement('p');
    dataElement.textContent = `${key}: ${value}`;
    container.appendChild(dataElement);
  });
  console.log('-----------------------')
});



// ************************************************** \\
// IMPORTS
// ************************************************** \\
// import { toggleGenerateButton } from './touchscreen/toggleGenerateButton.js';
// import { fadeIn, fadeOut } from './touchscreen/fades.js';
// import { randomPrompt } from './touchscreen/random-prompt.js';
// import { showModels } from './touchscreen/show-models.js';