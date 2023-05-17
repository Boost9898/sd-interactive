// ************************************************** \\
// TOUCHSCREEN CLIENT SCRIPT FOR SOCKET.IO SERVER
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
// PHOTOGRAPH 1 SCREEN
//
enablePhotoPreview(); // enable photo preview in advance, (if not, too much delay from webcam request)

const takePhotographButton = document.getElementById('take-photo-button');
const countdownElement = document.getElementById('countdown');
const photoFieldElement = document.getElementById('photo-flash');
const photoPreviewElement = document.getElementById('photo-preview');
let videoStream = null; // To store the webcam stream

takePhotographButton.addEventListener('click', function () {
  takePhotographButton.textContent = 'De foto wordt genomen';
  startCountdown();
});

function startCountdown() {
  countdownElement.style.display = 'block';
  let count = 3;

  function flashBackground() {
    photoFieldElement.style.backgroundColor = 'white';
    setTimeout(() => {
      photoFieldElement.style.backgroundColor = '';
    }, 1000);
  }

  function updateCountdown() {
    countdownElement.textContent = count;

    if (count === 0) {
      flashBackground();
      countdownElement.style.display = 'none';
      takePhotographButton.textContent = 'Foto maken';
      captureFrame(); // Call the function to capture the frame
    } else {
      count--;
      setTimeout(updateCountdown, 1000);
    }
  }

  updateCountdown();
}

function enablePhotoPreview() {
  navigator.mediaDevices.getUserMedia({ video: { aspectRatio: 704/795 } })
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
      const imageDataURL = canvas.toDataURL('image/png');
      displayPhotoPreview(imageDataURL);
    })
    .catch(error => {
      console.error('Error capturing frame:', error);
    });
}

function displayPhotoPreview(imageDataURL) {
  const imageElement = document.createElement('img');
  imageElement.src = imageDataURL;
  photoPreviewElement.appendChild(imageElement);
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
























//TODO REBUILD THIS IN THE INTERACTIVE

// // ************************************************** \\
// // IMPORTS
// // ************************************************** \\
// import { toggleGenerateButton } from './touchscreen/toggle-generate-button.js';
// import { fadeIn, fadeOut } from './touchscreen/fades.js';
// import { randomPrompt } from './touchscreen/random-prompt.js';
// import { showModels } from './touchscreen/show-models.js';


// // ************************************************** \\
// // GLOBAL AND EXPORTED VARIABELS
// // ************************************************** \\
// export const api = 'http://127.0.0.1:7861';
// let currentlyGenerating = undefined
// let generatedImageData = null
// const loader = document.querySelector("#loader-container");
// let staticImage = document.getElementById('staticImage');


// // ************************************************** \\
// // TXT2IMG API REQUEST
// // ************************************************** \\
// async function txt2img() {
//   let payload = {
//     prompt: randomPrompt(),
//     steps: 10,
//     width: 512,
//     height: 768
//   };
//   console.log(`Selected prompt: ${payload.prompt}`)
//   try {
//     toggleGenerateButton('txt2img', true);
//     currentlyGenerating = true;
//     fadeIn(loader, 1000);
//     const response = await fetch(`${api}/sdapi/v1/txt2img`, {
//       method: 'POST',
//       body: JSON.stringify(payload),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     generatedImageData = await response.json();
//     base64ToImage(generatedImageData.images[0]);
//     removeImageOverlay();
//     fadeOut(loader, 500);
//     toggleGenerateButton('txt2img', false);
//     currentlyGenerating = false;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // ************************************************** \\
// // ENCODE BASE64 TO IMAGE
// // place image in DOM (if already present, remove it
// // ************************************************** \\
// async function base64ToImage(arg) {
//   const generatedImage = new Image();
//   generatedImage.src = `data:image/png;base64,${arg}`;
//   await generatedImage.decode().catch(() => { }); // wait until image is decoded and continue code execution
//   document.getElementById("generatedImage").firstElementChild?.remove();
//   document.getElementById("generatedImage").appendChild(generatedImage);
// }

// function setImageOverlay() {
//   staticImage.style.backgroundImage = "url('images/image-01-mask-cut.png')";
// }

// function removeImageOverlay() {
//   staticImage.style.backgroundImage = "none";
// }



// // ************************************************** \\
// // GENERATE-TXT2IMG-BUTTON FUNCTIONALITY
// // prevent overflow of image generation processes
// // ************************************************** \\
// document.getElementById('generate-txt2img-button').addEventListener('click', function () {
//   if (!currentlyGenerating) {
//     txt2img();
//   } else {
//     console.log('Currently generating image.')
//   }
// });


// // ************************************************** \\
// // SHOW-MODELS-BUTTON
// // ************************************************** \\
// document.getElementById('show-models-button').addEventListener('click', function () {
//   showModels()
// });

// // ************************************************** \\
// // IMG2IMG STUFF (TODO: comments)
// // ************************************************** \\

// function fetchBase64FromUrl() {
//   const fetchBase64 = (url) => {
//     return fetch(url)
//       .then(response => response.blob())
//       .then(blob => {
//         const reader = new FileReader();
//         reader.readAsDataURL(blob);
//         return new Promise((resolve) => {
//           reader.onloadend = () => {
//             resolve(reader.result);
//           }
//         });
//       });
//   }

//   const fetchImage = fetchBase64('images/input/image-01.png');
//   const fetchMask = fetchBase64('images/input/image-01-mask.png');

//   Promise.all([fetchImage, fetchMask])
//     .then(([base64StringImage, base64StringMask]) => {
//       clearnBase64Strings(base64StringImage, base64StringMask);
//     });

//   function clearnBase64Strings(image, mask) {
//     mask = mask.substring("data:image/png;base64,".length);
//     image = image = image.substring("data:image/png;base64,".length);
//     img2img(mask, image);
//   }

//   async function img2img(mask, initImages) {
//     const payload = {
//       steps: 25,
//       width: 512,
//       height: 768,
//       denoising_strength: 0.7,
//       sampler_index: 'Euler',
//       prompt: 'young man, brown hair, portrait painting, detailed oil painting, renaissance, hyper realistic, 8k, detail, <lora:monet-wd14v10-000015:0.6>',
//       negative_prompt: 'EasyNegative:0.2',
//       // mask: mask,
//       init_images: [initImages],
//     };
//     console.log(payload)
//     console.log(payload.prompt);
//     try {
//       toggleGenerateButton('img2img', true);
//       currentlyGenerating = true;
//       fadeIn(loader, 1000);
//       const response = await fetch(`${api}/sdapi/v1/img2img`, {
//         method: 'POST',
//         body: JSON.stringify(payload),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
//       generatedImageData = await response.json();
//       setImageOverlay();
//       base64ToImage(generatedImageData.images[0]);
//       fadeOut(loader, 500);
//       toggleGenerateButton('img2img', false);
//       currentlyGenerating = false;
//     } catch (error) {
//       console.error(error);
//     }
//   }
// }

// // ************************************************** \\
// // GENERATE-IMG2IMG-BUTTON FUNCTIONALITY
// // prevent overflow of image generation processes
// // ************************************************** \\
// document.getElementById('generate-img2img-button').addEventListener('click', function () {
//   if (!currentlyGenerating) {
//     fetchBase64FromUrl();
//   } else {
//     console.log('Currently generating image.')
//   }
// });