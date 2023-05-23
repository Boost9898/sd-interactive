// ************************************************** \\
// INIT FUNCTIONALITY
// IMPORT LOCAL STABLE DIFFUSION API
// DECLARE GLOBAL VARIABLES
// ************************************************** \\
import * as sd from '../js/scripts/sd.js';

const takePhotographButton = document.getElementById('take-photo-button');
const countdownElement = document.getElementById('countdown');
const photoFieldElement = document.getElementById('photo-flash');
const photoPreviewElement = document.getElementById('photo-preview');

let videoStream = null;
let photoDataUrl = undefined;

// enable photo preview in advance, (if not, too much delay from webcam request)
enablePhotoPreview();

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
takePhotographButton.addEventListener('click', function () {
  takePhotographButton.textContent = 'De foto wordt genomen';
  startCountdown();
});

function startCountdown() {
  countdownElement.style.display = 'block';
  let count = 1;

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
      // takePhotographButton.textContent = 'Foto maken';
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
  if (takePhotographButton) {
    takePhotographButton.style.display = 'none';
  }

  // create and show continue and retake photo buttons
  const continuePhotographButton = document.createElement('div');
  const retakePhotographButton = document.createElement('div');
  takePhotographButton.parentNode.insertBefore(continuePhotographButton, takePhotographButton.nextSibling);
  takePhotographButton.parentNode.insertBefore(retakePhotographButton, takePhotographButton.nextSibling);
  continuePhotographButton.id = 'continue-photo-button';
  continuePhotographButton.textContent = 'Ga door';
  retakePhotographButton.id = 'retake-photo-button';
  retakePhotographButton.textContent = 'Opnieuw';

  // click handlers for continue and retake buttons
  continuePhotographButton.addEventListener('click', function () {
    socket.emit('continue_photo_button_clicked');
    initDiscoverScreen();
  });

  RetakePhotographButton.addEventListener('click', function () {
    startCountdown()

    // remove current photo-preview-capture
    document.getElementById('photo-preview-capture').remove();
  });
}


// 
// DISCOVER SCREEN
//
function initDiscoverScreen() {
  socket.emit('pass_photo_data_url', photoDataUrl);
  console.log('touchscreen.js: initDiscoverScreen()')

  // load painting in
  document.getElementById('painting').style.backgroundImage = 'url("./images/input/image-01.png")';

  // create and show continue and retake photo buttons
  const takePhotographButton = document.createElement('div');
  const RetakePhotographButton = document.createElement('div');
  takePhotographButton.parentNode.insertBefore(continuePhotographButton, takePhotographButton.nextSibling);
  takePhotographButton.parentNode.insertBefore(retakePhotographButton, takePhotographButton.nextSibling);
  continuePhotographButton.id = 'continue-photo-button';
  continuePhotographButton.textContent = 'Ga door';
  RetakePhotographButton.id = 'retake-photo-button';
  RetakePhotographButton.textContent = 'Opnieuw';
}


// 
// OVERLAY MANAGER
//
const buttonIds = ['header-info-button', 'header-restart-button', 'header-language-button'];

for (const buttonId of buttonIds) {
  const button = document.getElementById(buttonId);
  button.addEventListener('click', () => buttonClickHandler(buttonId));
}

function buttonClickHandler(buttonId) {
  console.log(`Button ${buttonId} was clicked!`);
  // Handle button click event here
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