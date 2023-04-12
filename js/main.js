// import js files
import { toggleGenerateButton } from './toggleGenerateButton.js';


// prepare global variables
const api = 'http://127.0.0.1:7860';
let generatedImageData
let busyGenerating = false

// set payload that will be used during generation process
const payload = {
  prompt: 'corgi',
  steps: 15,
  height: 512,
  width: 512
};

// txt2img api request
async function txt2img() {
  try {
    busyGenerating = true;
    toggleGenerateButton(busyGenerating);
    loopUntilProgressDone();
    const response = await fetch(`${api}/sdapi/v1/txt2img`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    generatedImageData = await response.json();
    busyGenerating = false;
    toggleGenerateButton(busyGenerating);
  } catch (error) {
    console.error(error);
  }
}

// return current progress of diffusion process
async function fetchProgress() {
  try {
    const response = await fetch(`${api}/sdapi/v1/progress?skip_current_image=false`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    });
    const data = await response.json();
    return data.progress;
  } catch (error) {
    console.error(error);
  }
}

// async function that updates the progress bar
async function loopUntilProgressDone() {
  const progressBar = document.getElementById('progress-bar');
  const intervalId = setInterval(async () => {
    const progress = await fetchProgress();
    const width = progress * 100;
    progressBar.style.width = `${width}%`;
    if (progress === 0) {
      clearInterval(intervalId);
      base64ToImage(generatedImageData.images[0]);
    }
  }, 1000);
}

// decode base64 output to image
// place image inside DOM (if there already is an image remove it) 
async function base64ToImage(arg) {
  const img = new Image();
  img.src = `data:image/png;base64,${arg}`;
  await img.decode().catch(() => {}); // wait until image is decoded and continue code execution
  document.getElementById("generatedImage").firstElementChild?.remove();
  document.getElementById("generatedImage").appendChild(img);
}

// prevent overflow of image generation processes by blocken txt2img() function
document.getElementById('generate-button').addEventListener('click', function () {
  if (!busyGenerating) {
    txt2img();
  } else {
    console.log('Currently generating image.')
  }
});