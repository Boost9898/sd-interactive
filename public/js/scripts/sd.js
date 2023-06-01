// ************************************************** \\
// IMPORTS
// ************************************************** \\
import { fadeIn, fadeOut } from './fades.js';
import * as touchscreen from '../touchscreen.js';


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
// export async function txt2img() {
//   let payload = {
//     prompt: 'Austronaut on a horse',
//     steps: 15,
//     width: 512,
//     height: 512
//   };

//   try {
//     currentlyGenerating = true;
//     // fadeIn(loader, 1000);
//     const response = await fetch(`${api}/sdapi/v1/txt2img`, {
//       method: 'POST',
//       body: JSON.stringify(payload),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     generatedImageData = await response.json();
//     console.log(generatedImageData.images[0]);
//     // base64ToImage(generatedImageData.images[0]);
//     // removeImageOverlay();
//     // fadeOut(loader, 500);
//     currentlyGenerating = false;
//   } catch (error) {
//     console.error(error);
//   }
// }


// ************************************************** \\
// IMG2IMG API AND HANDLING
// ************************************************** \\

export function img2img(photoDataUrl) {

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
    const [base64StringImage, base64StringMask, base64StringtestPhoto] = await Promise.all([
      fetchBase64FromUrl('images/input/image-02.png'),
      fetchBase64FromUrl('images/input/image-01-mask.png'),
    ]);

    // remove the prefix string (substring is more efficient although split shorter is)
    const image = base64StringImage.substring("data:image/png;base64,".length);
    const mask = base64StringMask.substring("data:image/png;base64,".length);

    // DEV: don't pass the mask since it's causing issues for now
    img2imgapi(image, photoDataUrl, mask);
  }

  loadImageAndMask();

  async function img2imgapi(image, photoDataUrl, mask) {

    const payload = {
      init_images: [image],
      resize_mode: 0,
      denoising_strength: 0.85,
      // mask_blur: 36,
      // inpainting_fill: 0,
      // inpaint_full_res: true,
      // inpaint_full_res_padding: 72,
      // inpainting_mask_invert: 0,
      // initial_noise_multiplier: 1,
      prompt: "bright, portrait painting, detailed oil painting, renaissance, hyper realistic, 8k, detail, <lora:monet-wd14v10-000015:0.3>", // DEV make it customisable
      negative_prompt: "bald, EasyNegative:0.3",
      // seed: 1472411147,
      sampler_name: "Heun",
      sampler_index: "Heun",
      batch_size: 1,
      steps: 12,
      cfg_scale: 7,
      width: 512,
      height: 768,
      restore_faces: true,
      tiling: false,
      send_images: true, // DEV
      save_images: true, // DEV
      alwayson_scripts: {
        ControlNet: {
          args: [
            {
              enabled: true,
              input_image: photoDataUrl,
              module: "canny",
              model: "control_v11p_sd15_canny [d14c016b]",
              weight: 1,
              width: 512,
              height: 768,
              processor_res: 512,
              resize_mode: "Crop and Resize",
              lowvram: false,
              control_mode: "Balanced", //My prompt is more important //ControlNet is more important //Balanced
              pixel_perfect: true,
              threshold_a: 50,
              threshold_b: 200,
              guidance_start: 0.0,
              guidance_end: 1.0,
              controlnet_guidance: 1.0,
            },
            {
              enabled: false,
              input_image: "",
              module: "",
              model: ""
            }
          ]
        }
      }
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
      touchscreen.catchGeneratedImageData(generatedImageData.images[0])
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