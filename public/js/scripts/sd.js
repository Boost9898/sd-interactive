// ************************************************** \\
// IMPORTS
// ************************************************** \\
import { fadeIn, fadeOut } from './fades.js';

// ************************************************** \\
// GLOBAL AND EXPORTED VARIABELS
// ************************************************** \\
export const api = 'http://127.0.0.1:7861';
let currentlyGenerating = undefined
let generatedImageData = null
const loader = document.querySelector("#loader-container");
let staticImage = document.getElementById('staticImage');


// ************************************************** \\
// SHOW ALL AVAILABLE MODELS IN CONSOLE
// ************************************************** \\
export async function showModels() {
  try {
    const response = await fetch(`${api}/sdapi/v1/sd-models`);
    const models = await response.json();
    console.log(models);
  } catch (error) {
    console.error(error);
  }
}

// ************************************************** \\
// TXT2IMG API REQUEST
// ************************************************** \\
export async function txt2img() {
  let payload = {
    prompt: 'Austronaut on a horse',
    steps: 15,
    width: 512,
    height: 512
  };

  try {
    currentlyGenerating = true;
    // fadeIn(loader, 1000);
    const response = await fetch(`${api}/sdapi/v1/txt2img`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    generatedImageData = await response.json();
    console.log(generatedImageData.images[0]);
    // base64ToImage(generatedImageData.images[0]);
    // removeImageOverlay();
    // fadeOut(loader, 500);
    currentlyGenerating = false;
  } catch (error) {
    console.error(error);
  }
}




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

// ************************************************** \\
// IMG2IMG STUFF (TODO: comments)
// ************************************************** \\

export function img2img() {

  console.log('sd img2img')

  // Fetches image from URL and converts it to a base64 string
  // Returns a promise that resolves with the base64 string
  async function fetchBase64FromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const base64String = await blobToBase64(blob);
    return base64String;
  }

  // Converts a Blob object to a base64 string
  // Returns a promise that resolves with the base64 string
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => resolve(fileReader.result);
      fileReader.onerror = reject;
      fileReader.readAsDataURL(blob);
    });
  }

  // Load async image and mask, process them, and pass them to the img2imgapi() function
  async function loadImageAndMask() {
    const [base64StringImage, base64StringMask] = await Promise.all([
      fetchBase64FromUrl('images/input/image-01.png'),
      fetchBase64FromUrl('images/input/image-01-mask.png')
    ]);

    // remove the prefix string (substring is more efficient although split shorter is)
    const image = base64StringImage.substring("data:image/png;base64,".length);
    const mask = base64StringMask.substring("data:image/png;base64,".length);

    img2imgapi(image, mask);
  }

  loadImageAndMask();

  async function img2imgapi(initImages, mask) {
    const payload = {
      steps: 10,
      width: 512,
      height: 768,
      denoising_strength: 2,
      sampler_index: 'Euler',
      prompt: 'young man, brown hair, portrait painting, detailed oil painting, renaissance, hyper realistic, 8k, detail, <lora:monet-wd14v10-000015:0.6>',
      negative_prompt: 'EasyNegative:0.2',
      init_images: [initImages],
    };

    try {
      const response = await fetch(`${api}/sdapi/v1/img2img`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      generatedImageData = await response.json();
      console.log(generatedImageData)
    } catch (error) {
      console.error(error);
    }
  }
}

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