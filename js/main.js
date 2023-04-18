// ************************************************** \\
// IMPORTS
// ************************************************** \\
import { toggleGenerateButton } from './toggleGenerateButton.js';
import { randomPrompt } from './randomPrompt.js';
import { showModels } from './showModels.js';


// ************************************************** \\
// GLOBAL AND EXPORTED VARIABELS
// ************************************************** \\
export const api = 'http://127.0.0.1:7860';
let currentlyGenerating = undefined
let generatedImageData = null
const loader = document.querySelector("#loader-container");


// ************************************************** \\
// PAYLOAD FOR GENERATION PROCESS
// ************************************************** \\
let payload = {
  prompt: undefined,
  steps: 6,
  height: 512,
  width: 512
};


// ************************************************** \\
// TXT2IMG API REQUEST
// ************************************************** \\
async function txt2img() {
  payload.prompt = randomPrompt();
  console.log(`Selected prompt: ${payload.prompt}`)
  try {
    toggleGenerateButton(true);
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
    fadeOut(loader, 500);
    toggleGenerateButton(false);
  } catch (error) {
    console.error(error);
  }
}

// ************************************************** \\
// ENCODE BASE64 TO IMAGE
// place image in DOM (if already present, remove it
// ************************************************** \\
async function base64ToImage(arg) {
  const img = new Image();
  img.src = `data:image/png;base64,${arg}`;
  await img.decode().catch(() => { }); // wait until image is decoded and continue code execution
  document.getElementById("generatedImage").firstElementChild?.remove();
  document.getElementById("generatedImage").appendChild(img);
}

// ************************************************** \\
// LOADER FADE IN/FADE OUT
// ************************************************** \\
function fadeIn(element, duration) {
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.classList.add("show");
}

// Fade out function
function fadeOut(element, duration) {
  element.style.transition = `opacity ${duration}ms ease-in-out`;
  element.classList.remove("show");
}

// ************************************************** \\
// GENERATE-BUTTON FUNCTIONALITY
// prevent overflow of image generation processes
// ************************************************** \\
document.getElementById('generate-button').addEventListener('click', function () {
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
// SET MODEL DEMO CODE
// ************************************************** \\
// // setModel
// document.getElementById('load-model-button').addEventListener('click', function () {
//   if (!currentlyGenerating) {
//     setModel('v1-5-pruned-emaonly.safetensors [6ce0161689]');
//   } else {
//     console.log('Currently generating image.')
//   }
// });

// async function setModel(model) {
//   const option_payload = {
//     "sd_model_checkpoint": `${model}`,
//     "CLIP_stop_at_last_layers": 2
//   };
//   try {
//     const response = await fetch(`${api}/sdapi/v1/options`, {
//       method: 'POST',
//       body: JSON.stringify(option_payload),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     let data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }