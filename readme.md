# Ontdek de kunst interactive 🎨🖌️🖼️

<br>

## Introduction
This project has undergone several iterations and currently stands as a proof of concept prototype/minimum viable product.

This project leverages Stable Diffusion to generate a custom version of an existing artwork. It allows visitors to create a version of a famous artists portrait with their own face in it. The code is designed to demonstrate a minimum viable product and is purely meant as a proof of concept prototype.

It is important to note that deploying this in a live environment without further refinement and testing may not be advisable.

<br>

## Install Stable Diffusion and dependencies
Make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies) for using Stable Diffusion are met and follow the instructions available for [NVidia](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs) GPUs.

### Automatic Installation on Windows 10/11 with NVidia-GPUs using release package
1. Install [Python 3.10.6](https://www.python.org/downloads/release/python-3106/) (Newer version of Python does not support torch), checking "Add Python to PATH"
2. Install [git](https://git-scm.com/download/win)
3. Download the stable-diffusion-webui repository, by running `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git` from the folder where you want to install it
4. Add at least the following arguments to `webui-user.bat`. [Note 1](#note-1:-explanation-of-commandline-arguments)
```bash
set COMMANDLINE_ARGS=--xformers --cors-allow-origins=* --api --nowebui
```
5. Run `webui-user.bat` from Windows Explorer

<br>

### Note 1: explanation of commandline arguments
- xformers: improve speed of generation process
- cors: allow cross origin usage
- api: enables api (api documentation is accessible on: [http://127.0.0.1:7861/docs](http://127.0.0.1:7861/docs))
- nowebui: disables webui (remove this argument to enable webui, note that this will disable the API, accessible on: [http://127.0.0.1:786](http://127.0.0.1:7860)
- OPTIONAL: enable `--medvram` to makes the system use less GPU VRAM

<br>

## Install ControlNet
Install ControlNet, make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies) are installed.

1. Launch StableDiffusion webui by starting `webui-user.bat`
2. Open "Extensions" tab
3. Open "Install from URL" tab in the tab
4. Enter `https://github.com/Mikubill/sd-webui-controlnet.git` to "URL for extension's git repository"
5. Press "Install" button
6. Wait until you get the message "Installed into stable-diffusion-webui\extensions\sd-webui-controlnet. Use Installed tab to restart"
7. Go to "Installed" tab, click "Check for updates", and then click "Apply and restart UI"  (_Note: the next time you can also use these buttons to update ControlNet_)
8. Fully restart the A1111 webui (close the terminal)
9. Download the models (see below)
10. After you put models in the correct folder, you may need to refresh to see the models


### Download and install ControlNet models
1. Navigate to [ControlNet-v1-1](https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main)
2. Click on the three dots upper right corner
3. Click on clone repository
4. Run the first line (if never executed before)
5. Run 'git clone' line in the following folder: "..\stable-diffusion-webui\models\ControlNet" (_Note: terminal does not update it's status, wait until cursor is back_)
6. Move all the cloned content up by one folder
7. Put models in your "..\stable-diffusion-webui\extensions\sd-webui-controlnet\models". You only need to download "pth" files

<br>

## Set-up and configure 'Ontdek de kunst' interactive

### Setup
1. Run "npm install"
2. If you want to use your own images, set them in `sd-interactive\images\input` and `sd-interactive\images\preview` and make sure they have the same resolution as the POST request sends.
3. Download the [EasyNegative](https://civitai.com/models/7808/easynegative) textual embedding and place it in: `..\stable-diffusion-webui\embeddings`
4. Download the [monet](https://civitai.com/images/375698?modelId=21482&postId=81508&id=21482&slug=claude-monet-painting-style) LORA and place it in: `..\stable-diffusion-webui\models\Lora`

<br>

## Start application
1. Run `npm run dev` to start the application
2. When developing, run `npm run scss` to start SASS watch (CSS compiler)

<br>

## DEV: notes
- In `public\js\scripts\sd.js`, set `save_images: true` to false in the payload if you do not want to automatically save all generated results
- When setting-up the application, it is neccesary to set the desired StableDiffusion API payload in `public\js\scripts\sd.js`. The parameter values depend on your unique situation. Lighting, camera quality and composition matter a lot. It is recommended to fiddle around using the WebUI. When satisfied, manually transfer the settings to the payload. It is up until this day not possible to export the payload from the WebUI.
- Gradio removed the possibility to use the webui and API documentation at the same time
- If you want to read the API documentation, add `--nowebui` to the COMMANDLINE_ARGS.
- Make sure to check the port number, it could swap between :7860 and :7861
- It is recommended to use a high-quality webcam for the best results. (_High-quality refers to an image with with at least the same or greater resolution as the generated image (512x768 pixels). The image must also be sharp and shouldn't contain noise._

<br>

## DEV: TODO
The code has been thoroughly commented to provide clarity on the purpose and functionality of each code segment. Additionally, below is listed which parts of the code need to be improved, to improve the projects maintainability and scalability:

1. Improve the Stable Diffusion API payload; alignment of input image, ControlNet parameters, research new preprocessors, possibility to create a LoRA which suites the desired style and use the latest style transferring methods
2. Add functionality to language switch overlay
3. Add information from corresponding state to infoOverlay
4. Remove unused code in app.js (no need for looping through multiple Displays)
5. Handle the end/stop of the application in app.js by resetting the application, instead of reloading both screens
6. When the users grants permission, save the result locally and fetch it in Display attract screen function.
7. Prevent duplicated images in the attract state of Display
8. In some rare cases, there will be used duplicates of HTML IDs - replace them with unique IDs
9. Change the styling to match the clients desires.
10. Minor bug: when updating the image at the Discover state, the swap causes a very little flash (need to pre-load image)
11. Minor bug: 'infoOverlay' and 'languageOverlay' can be active at the same time. Prevent this
12. Encapsulate and move code to own object/functions (or even files) to keep it modular
13. Remove unused commented-out code