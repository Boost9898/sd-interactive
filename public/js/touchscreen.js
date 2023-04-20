// ************************************************** \\
// TODO, FIX NAME FOR THIS
// ************************************************** \\
console.log('touchscreen.js');

let clientId = 'unknown',
  debugMode = false;

/* Socket: receive initial data */
socket.on('initialData', function (data) {
  clientId = data.clientId;
  window.location.hash = clientId;
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
import { toggleGenerateButton } from './touchscreen/toggle-generate-button.js';
import { fadeIn, fadeOut } from './touchscreen/fades.js';
import { randomPrompt } from './touchscreen/random-prompt.js';
import { showModels } from './touchscreen/show-models.js';


// ************************************************** \\
// GLOBAL AND EXPORTED VARIABELS
// ************************************************** \\
export const api = 'http://127.0.0.1:7860';
let currentlyGenerating = undefined
let generatedImageData = null
const loader = document.querySelector("#loader-container");
let staticImage = document.getElementById('staticImage');


// ************************************************** \\
// TXT2IMG API REQUEST
// ************************************************** \\
async function txt2img() {
  let payload = {
    prompt: randomPrompt(),
    steps: 10,
    width: 512,
    height: 768
  };
  console.log(`Selected prompt: ${payload.prompt}`)
  try {
    toggleGenerateButton('txt2img', true);
    currentlyGenerating = true;
    fadeIn(loader, 1000);
    const response = await fetch(`${api}/sdapi/v1/txt2img`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    generatedImageData = await response.json();
    base64ToImage(generatedImageData.images[0]);
    removeImageOverlay();
    fadeOut(loader, 500);
    toggleGenerateButton('txt2img', false);
    currentlyGenerating = false;
  } catch (error) {
    console.error(error);
  }
}

// ************************************************** \\
// ENCODE BASE64 TO IMAGE
// place image in DOM (if already present, remove it
// ************************************************** \\
async function base64ToImage(arg) {
  const generatedImage = new Image();
  generatedImage.src = `data:image/png;base64,${arg}`;
  await generatedImage.decode().catch(() => { }); // wait until image is decoded and continue code execution
  document.getElementById("generatedImage").firstElementChild?.remove();
  document.getElementById("generatedImage").appendChild(generatedImage);
}

function setImageOverlay() {
  staticImage.style.backgroundImage = "url('images/image-01-mask-cut.png')";
}

function removeImageOverlay() {
  staticImage.style.backgroundImage = "none";
}



// ************************************************** \\
// GENERATE-TXT2IMG-BUTTON FUNCTIONALITY
// prevent overflow of image generation processes
// ************************************************** \\
document.getElementById('generate-txt2img-button').addEventListener('click', function () {
  if (!currentlyGenerating) {
    txt2img();
  } else {
    console.log('Currently generating image.')
  }
});


// ************************************************** \\
// SHOW-MODELS-BUTTON
// ************************************************** \\
document.getElementById('show-models-button').addEventListener('click', function () {
  showModels()
});

// ************************************************** \\
// IMG2IMG STUFF (TODO: comments)
// ************************************************** \\

function fetchBase64FromUrl() {
  const fetchBase64 = (url) => {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          }
        });
      });
  }

  const fetchImage = fetchBase64('images/input/image-01.png');
  const fetchMask = fetchBase64('images/input/image-01-mask.png');

  Promise.all([fetchImage, fetchMask])
    .then(([base64StringImage, base64StringMask]) => {
      clearnBase64Strings(base64StringImage, base64StringMask);
    });

  function clearnBase64Strings(image, mask) {
    mask = mask.substring("data:image/png;base64,".length);
    image = image = image.substring("data:image/png;base64,".length);
    img2img(mask, image);
  }

  async function img2img(mask, initImages) {
    const payload = {
      steps: 8,
      width: 512,
      height: 768,
      denoising_strength: 0.4,
      sampler_index: 'DPM++ 2M Karras',
      // mask_blur: 10,
      // prompt: randomPrompt(),
      prompt: 'warrior, close up, portrait, Rembrandt, oil painting, greg rutkowski',
      // mask: mask,
      init_images: [initImages],
    };
    console.log(payload.prompt);
    try {
      toggleGenerateButton('img2img', true);
      currentlyGenerating = true;
      fadeIn(loader, 1000);
      const response = await fetch(`${api}/sdapi/v1/img2img`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      generatedImageData = await response.json();
      setImageOverlay();
      base64ToImage(generatedImageData.images[0]);
      fadeOut(loader, 500);
      toggleGenerateButton('img2img', false);
      currentlyGenerating = false;
    } catch (error) {
      console.error(error);
    }
  }
}

// ************************************************** \\
// GENERATE-IMG2IMG-BUTTON FUNCTIONALITY
// prevent overflow of image generation processes
// ************************************************** \\
document.getElementById('generate-img2img-button').addEventListener('click', function () {
  if (!currentlyGenerating) {
    fetchBase64FromUrl();
  } else {
    console.log('Currently generating image.')
  }
});