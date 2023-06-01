// ************************************************** \\
// INIT FUNCTIONALITY
// IMPORT LOCAL STABLE DIFFUSION API
// DECLARE GLOBAL VARIABLES
// ************************************************** \\
import * as sd from '../js/scripts/sd.js';

const takePhotoButton = document.getElementById('take-photo-button');
const countdownElement = document.getElementById('countdown');
const photoFieldElement = document.getElementById('photo-flash');
const photoPreviewElement = document.getElementById('photo-preview');

let videoStream = null;
let photoDataUrl = undefined;
let generatedImage = undefined;

// enable photo preview in advance, (if not, too much delay from webcam request)
enablePhotoPreview();
overlayManager()

// ************************************************** \\
// TOUCHSCREEN CLIENT FOR SOCKET.IO SERVER
// ************************************************** \\
console.log('touchscreen.js');

let clientId = 'unknown',
  debugMode = false;

// Socket: receive initial data
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

document.getElementById('send-button').addEventListener('click', function () {
  console.log('clicked: send-button');
  socket.emit('touchscreen_data');
});


// 
// TEST
//
document.getElementById('delete-button').addEventListener('click', function () {
  socketSendDeleteTest();
});

function socketSendDeleteTest() {
  console.log('Sent delete');
  socket.emit('touchscreen_data_delete', 'delete');
}



// 
// ATTRACT SCREEN
//
// add click event listener to every language button and click function
const languageButtons = document.querySelectorAll('#language-buttons p');
languageButtons.forEach(button => {
  button.addEventListener('click', languageButtonClick);
});

function languageButtonClick(event) {
  const language = event.target.id;
  socket.emit('language_clicked', language);
  console.log(`language_clicked: ${language}`);
}


// 
// LEGAL SCREEN
//
const confirmApplicationButton = document.getElementById('confirm-application-button');
confirmApplicationButton.addEventListener('click', function () {
  socket.emit('confirm_application_clicked');
});


// 
// PHOTOGRAPH SCREEN
//
takePhotoButton.addEventListener('click', function () {
  takePhotoButton.textContent = 'De foto wordt genomen';
  startCountdown();
});

function startCountdown() {
  countdownElement.style.display = 'block';
  let count = 1; // DEV

  function flashBackground() {
    photoFieldElement.style.backgroundColor = 'white';
    setTimeout(() => {
      photoFieldElement.style.backgroundColor = '';
      switchPhotoButtons()
      updateLeftColumnInfo();
    }, 1000);
  }

  function updateCountdown() {
    countdownElement.textContent = count;

    if (count === 0) {
      flashBackground();
      countdownElement.style.display = 'none';
      // takePhotoButton.textContent = 'Foto maken';
      captureFrame();
    } else {
      count--;
      setTimeout(updateCountdown, 1000);
    }

  }

  updateCountdown();
}

function updateLeftColumnInfo() {
  const columnLeft = document.getElementById('column-left');
  columnLeft.querySelector('p').remove();
  const confirmText = document.createElement('p');
  confirmText.innerHTML = '<b>Ga door als je tevreden bent met de foto.</b><br><br> Niet tevreden? Maak de foto opnieuw.';
  columnLeft.appendChild(confirmText);
}

function enablePhotoPreview() {
  navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 704 / 795 } })
    .then(stream => {
      videoStream = stream; // Store the webcam stream
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      photoPreviewElement.appendChild(videoElement);
    })
    .catch(error => {
      console.error('Error accessing webcam:', error);
    });
}

function captureFrame() {
  if (!videoStream) {
    console.error('Webcam stream not available');
    return;
  }

  const videoTrack = videoStream.getVideoTracks()[0];
  const imageCapture = new ImageCapture(videoTrack);

  imageCapture.grabFrame()
    .then(imageBitmap => {
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0);
      photoDataUrl = canvas.toDataURL('image/png');
      displayPhotoPreview();
    })
    .catch(error => {
      console.error('Error capturing frame:', error);
    });
}

function displayPhotoPreview() {
  const photoPreviewCapture = document.getElementById('photo-preview-capture');

  if (photoPreviewCapture) {
    photoPreviewCapture.src = photoDataUrl;
  } else {
    const newPhotoPreviewCapture = document.createElement('img');
    newPhotoPreviewCapture.src = photoDataUrl;
    newPhotoPreviewCapture.id = 'photo-preview-capture';
    photoPreviewElement.appendChild(newPhotoPreviewCapture);
  }
}

function switchPhotoButtons() {

  // hide first take photo button
  if (takePhotoButton) {
    takePhotoButton.style.display = 'none';
  }

  // create and show continue and retake photo buttons
  const continuePhotoButton = document.createElement('div');
  const retakePhotobutton = document.createElement('div');
  takePhotoButton.parentNode.insertBefore(continuePhotoButton, takePhotoButton.nextSibling);
  takePhotoButton.parentNode.insertBefore(retakePhotobutton, takePhotoButton.nextSibling);
  continuePhotoButton.id = 'continue-photo-button';
  continuePhotoButton.textContent = 'Ga door';
  retakePhotobutton.id = 'retake-photo-button';
  retakePhotobutton.textContent = 'Opnieuw';

  // click handlers for continue and retake buttons
  continuePhotoButton.addEventListener('click', function () {
    socket.emit('continue_photo_button_clicked');
    initDiscoverScreen();
  });

  retakePhotobutton.addEventListener('click', function () {
    startCountdown()

    // remove current photo-preview-capture
    document.getElementById('photo-preview-capture').remove();
  });
}


// 
// DISCOVER SCREEN
//

// Start image generation process via API in sd.js
function initDiscoverScreen() {
  console.log('touchscreen.js: initDiscoverScreen()');

  sd.img2img(photoDataUrl);

  socket.emit('pass_photo_data_url', photoDataUrl);

  // load painting in
  document.getElementById('painting').style.backgroundImage = 'url("./images/input/image-02.png")';

  createDiscoverButtons();
  createDiscoverMarkers();

  function createDiscoverButtons() {
    // create and fill content discover buttons
    const getPhotoButton = document.createElement('div');
    getPhotoButton.id = 'get-photo-button';
    getPhotoButton.textContent = 'Neem mee';

    const deletePhotoButton = document.createElement('div');
    deletePhotoButton.id = 'delete-photo-button';
    deletePhotoButton.textContent = 'Verwijder';

    // append the div elements to parent DOM element
    const discoverButtons = document.getElementById('discover-buttons');
    discoverButtons.appendChild(getPhotoButton);
    discoverButtons.appendChild(deletePhotoButton);

    // create toggle used in deletePhotoButton() to prevent overload
    let toggle = false

    // add event listeners to the buttons
    deletePhotoButton.addEventListener('click', function () {
      if (generatedImage && toggle === false) {
        toggle = true;
        socket.emit('delete_generated_image', true);
        generatedImage.remove();
        getPhotoButton.remove();
        deletePhotoButton.style.width = '36.6%';
        deletePhotoButton.style.right = '0px';
        deletePhotoButton.style.backgroundColor = '#646464';
        deletePhotoButton.style.opacity = '50%';
        deletePhotoButton.textContent = 'Verwijderd';
        console.log('Genereated image removed');
      } else if (!generatedImage) {
        console.log('Generated image not present');
      } else if (toggle === true) {
        console.log('Generated image is already removed');
      } else {
        console.log('Something else is broken');
      }
    });

    getPhotoButton.addEventListener('click', function () {
      const getPhotoContainer = document.getElementById('get-photo-overlay');
      getPhotoContainer.classList.toggle('active');
    });
  }


  function createDiscoverMarkers() {
    const divContainer = document.getElementById('markers');
    let activeMarker = null; // Store the reference to the active marker

    // Fetch json data
    fetch('/data/data.json')
      .then(response => response.json())
      .then(data => {
        data.markers.forEach(marker => {
          const markerElement = document.createElement('div');

          // markerElement.textContent = marker.id; //DEV: show marker id inside marker
          markerElement.classList.add('marker');
          markerElement.id = `marker-${marker.id}`;

          // Set inline css left and top properties based on 'x' and 'y' values in JSON
          markerElement.style.left = `${marker.x}px`;
          markerElement.style.top = `${marker.y}px`;

          // Set animation delay based on index
          markerElement.style.animationDelay = `${getRandomNumber(0, 10)}s`;

          markerElement.addEventListener('click', () => {
            // Remove 'active' class from the previous active marker (if any)
            if (activeMarker) {
              activeMarker.classList.remove('active');
            }

            // Add 'active' class to the clicked marker
            markerElement.classList.add('active');

            // Store the reference to the current active marker
            activeMarker = markerElement;

            // DEV purposes
            console.log(`Clicked marker with ID: ${marker.id}`);

            // Send data to app.js -> display.js
            socket.emit('marker_data', { marker });
          });

          divContainer.appendChild(markerElement);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Return random round number between min and max (including extremes)
    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
  }
}

export function catchGeneratedImageData(generatedImageData) {
  console.log('caught generated image');
  sendGeneratedImageData(generatedImageData)

  // stop pulse-overlay animation and fade overlay out to reveal generated result
  const photoLoader = document.getElementById('photo-loader')
  photoLoader.classList.remove('pulse-overlay');
  photoLoader.classList.add('fade-out');
}

// create div, place base64image in dom and send to app.js
function sendGeneratedImageData(generatedImageData) {
  socket.emit('pass_generated_image_data', { photoData: generatedImageData });

  generatedImage = document.createElement('div');
  generatedImage.id = 'generated-image';
  generatedImage.style.backgroundImage = `url('data:image/png;base64, ${generatedImageData}')`;
  document.querySelector('#touch-discover-state #photo-field').appendChild(generatedImage);
}


// 
// OVERLAY MANAGER
//
function overlayManager() {
  const buttonParentIds = ['header-buttons-1', 'header-buttons-2'];
  const buttonFunctions = {
    'header-info-button': handleInfoButtonClick,
    'header-restart-button': handleRestartButtonClick,
    'header-language-button': handleLanguageButtonClick
  };

  for (const parentId of buttonParentIds) {
    const parent = document.getElementById(parentId);
    for (const buttonId in buttonFunctions) {
      const button = parent.querySelector(`#${buttonId}`);
      if (button) {
        button.onclick = buttonFunctions[buttonId];
      }
    }
  }

  function handleInfoButtonClick() {
    console.log('Header Info Button clicked!');
    // Handle 'header-info-button' click here
  }

  function handleRestartButtonClick() {
    console.log('Header Restart Button clicked!');
    // TODO handle this from app.js to restart the entire application without fresreshing
    location.reload();
  }

  function handleLanguageButtonClick() {
    console.log('Header Language Button clicked!');
    // Handle 'header-language-button' click here
  }
}




// 
// STATE MANAGER
//
// Function to show a specific state and hide the others
// NOTE: always call this function via app.js to prevent misalignment of states
function activateState(divId) {
  const divs = document.getElementsByClassName('touchscreen-state');
  for (const div of divs) {
    if (div.id === divId) {
      div.style.display = 'block'; // Show the selected div
    } else {
      div.style.display = 'none'; // Hide other divs
    }
  }
}

socket.on('touchscreen_state_switch', function (data) {
  console.log(data)
  activateState(data);
});

// Inital start of main screen
// TODO: activate it by default from app.js
activateState('touch-attract-state');


// 
// INACTIVITY TRACKER
//
let inactivityTimeout;

function checkInactivity() {
  clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    console.log('User is inactive');
  }, 60_000); // 60_000 milliseconds = 1 minute
}

function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  checkInactivity();
}

// call the resetInactivityTimer function whenever there's user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Initial start of the inactivity timer
checkInactivity();
