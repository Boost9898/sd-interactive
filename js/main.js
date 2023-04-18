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


// ************************************************** \\
// PAYLOAD FOR GENERATION PROCESS
// ************************************************** \\
let payload = {
  prompt: undefined,
  steps: 8,
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
    const response = await fetch(`${api}/sdapi/v1/txt2img`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    generatedImageData = await response.json();
    base64ToImage(generatedImageData.images[0]);
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