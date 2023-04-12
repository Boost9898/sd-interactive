// prepare global variables
const api = 'http://127.0.0.1:7860';
let generatedImageData

// set payload that will be used during generation process
const payload = {
  prompt: 'corgi puppy',
  steps: 3
};

// txt2img
async function txt2img() {
  try {
    const response = await fetch(`${api}/sdapi/v1/txt2img`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    generatedImageData = data;
    // console.log(data);
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

// stops the loop when diffusion process is finished
async function loopUntilProgressDone() {
  const intervalId = setInterval(async () => {
    const progress = await fetchProgress();
    console.log(progress);
    if (progress === 0) {
      clearInterval(intervalId);
      // console.log(generatedImageData.images[0]);
      base64ToImage(generatedImageData.images[0]);
    }
  }, 1000);
}

async function base64ToImage(params) {
  let generatedBase64Image = `data:image/png;base64,${params}`;
  const img = new Image();
  img.src = generatedBase64Image;
  document.getElementById("generatedImage").appendChild(img);
}

txt2img();
loopUntilProgressDone();
