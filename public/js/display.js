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

// 
// INIT ATTRACT (LANGUAGE)
//
function activateAttract() {
  console.log('activateAttract')

  // TODO: fetch available images dynamically instead of fixed amount
  const smallFrames = document.querySelectorAll('.small-frames');
  const imagePaths = [
    'images/attract/1.jpg',
    'images/attract/2.jpg',
    'images/attract/3.jpg',
    'images/attract/4.jpg',
    'images/attract/5.jpg',
    'images/attract/6.jpg',
    'images/attract/7.jpg',
    'images/attract/8.jpg',
    'images/attract/9.jpg',
    'images/attract/10.jpg',
    'images/attract/11.jpg',
    'images/attract/12.jpg',
  ];

  crossFade();

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Create random in- and out-fade behaviour for small image frames on attract screen
  function crossFade() {
    smallFrames.forEach((frame) => {
      const randomImageIndex = Math.floor(Math.random() * imagePaths.length);
      frame.style.opacity = '0';
      // console.log('crossFade') //DEV: debug log
      setTimeout(() => {
        // console.log('fade-in') //DEV: debug log
        frame.style.backgroundImage = `url(${imagePaths[randomImageIndex]})`;
        frame.style.opacity = '1';
        setTimeout(() => {
          // console.log('fade-out') //DEV: debug log
          frame.style.opacity = '0';
        }, getRandomNumber(7000, 7500));

      }, getRandomNumber(1500, 3000));
    });
  }
  setInterval(crossFade, 10_000);
};
activateAttract()

// DEV TODO: testing purpose
socket.on('display_language_switch', function (data) {
  const setLanguageElement = document.getElementById('set-language');
  setLanguageElement.textContent = `Language set to: ${data} `;
});

socket.on('continue_attract', function (data) {
  // const setLanguageElement = document.getElementById('set-language');
  // setLanguageElement.textContent = `Language set to: ${data} `;
});


// 
// DISCOVER
//
socket.on('hide_attract_screen', function () {
  document.getElementById('large-frame-container').classList.add('fade-out');
  document.getElementById('small-frames-container').classList.add('fade-out');
});


// 
// RECEIVING AND SHOWING IMAGES
//
socket.on('photo_data_url', function (photoDataUrl) {
  console.log(photoDataUrl);
  // Displays taken photo
  // displayBase64Image(photoDataUrl);
})

socket.on('generated_image', function (photoData) {
  console.log('display: caught generated_image')
  console.log(photoData.photoData);
  displayBase64Image(photoData.photoData);

  // TODO: pre-load image to avoid flickering
  document.getElementById('display-artwork').style.backgroundImage = 'url(/images/input/image-02-mask-cut.png)';
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
    document.getElementById('display-artwork').style = '';
    document.getElementById('generated-image').remove();
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

    if (key === 'image') {
      const imageMarker = document.createElement('div');
      imageMarker.classList.add('marker-element', 'show');
      imageMarker.id = `marker-${key}`;
      imageMarker.style.backgroundImage = `url(${value})`;
      container.appendChild(imageMarker);
    } else if (key === 'title' || key === 'desc') {
      const dataMarker = document.createElement('p');
      dataMarker.classList.add('marker-element', 'show');
      dataMarker.id = `marker-${key}`;
      dataMarker.textContent = value;
      container.appendChild(dataMarker);
    }
  });
  console.log('-----------------------')
});


// 
// FINNISH APPLICATION
//
socket.on('reload_application', function (data) {
  location.reload();
});


// ************************************************** \\
// IMPORTS
// ************************************************** \\
// import { toggleGenerateButton } from './touchscreen/toggleGenerateButton.js';
// import { fadeIn, fadeOut } from './touchscreen/fades.js';
// import { randomPrompt } from './touchscreen/random-prompt.js';
// import { showModels } from './touchscreen/show-models.js';