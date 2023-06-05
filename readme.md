# Ontdek de kunst interactive 🎨🖌️🖼️

<br>

## Introduction
This project has undergone several technical iterations and currently stands as a proof of concept prototype or minimum viable product. It is important to note that deploying this in a live environment without further refinement and testing may not be advisable.

<br>

## Installation Stable Diffusion and dependencies
Make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies) are met and follow the instructions available for [NVidia](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs) GPUs.

### Automatic Installation on Windows 10/11 with NVidia-GPUs using release package
1. Install [Python 3.10.6](https://www.python.org/downloads/release/python-3106/) (Newer version of Python does not support torch), checking "Add Python to PATH".
2. Install [git](https://git-scm.com/download/win).
3. Download the stable-diffusion-webui repository, by running `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
4. Add the following arguments to `webui-user.bat`
```bash
set COMMANDLINE_ARGS=--xformers --cors-allow-origins=* --api --nowebui
```
5. Run `webui-user.bat` from Windows Explorer

### Note: explanation of commandline arguments:
- xformers: improve speed of generation process
- cors: allow cross origin usage
- api: enables api (api documentation is accessible on: [http://127.0.0.1:7861/docs](http://127.0.0.1:7861/docs))
- nowebui: disables webui (remove this argument to enable webui, note that this will disable the API, accessible on: [http://127.0.0.1:786](http://127.0.0.1:7860)
- OPTIONAL: enable `--medvram` to makes the system use less GPU VRAM

<br>

## Installation ControlNet
Install ControlNet, make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies) are installed.

1. Launch StableDiffusion webui by starting `webui-user.bat`
2. Open "Extensions" tab
3. Open "Install from URL" tab in the tab
4. Enter `https://github.com/Mikubill/sd-webui-controlnet.git` to "URL for extension's git repository"
5. Press "Install" button
6. Wait, you will see the message "Installed into stable-diffusion-webui\extensions\sd-webui-controlnet. Use Installed tab to restart"
7. Go to "Installed" tab, click "Check for updates", and then click "Apply and restart UI". (The next time you can also use these buttons to update ControlNet.)
8. Completely restart A1111 webui including your terminal
9. Download models (see below)
10. After you put models in the correct folder, you may need to refresh to see the models

### Download and install ControlNet models
1. Navigate to [ControlNet-v1-1](https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main)
2. Click on the three dots upper right corner
3. Click on clone repository
4. Run the first line (if never executed before)
5. Run 'git clone' line in the following folder: C:\Projects\sd\stable-diffusion-webui\models\ControlNet
6. Note: terminal does not update it's status, wait until cursor is back
7. Move all the cloned content up by one folder
8. Put models in your "stable-diffusion-webui\extensions\sd-webui-controlnet\models". You only need to download "pth" files.

<br>

## Set-up and configure 'Ontdek de kunst' interactive

### Setup
1. Run "npm install"
2. Update path in `sass-watch.bat` to path's root of project folder
3. Configure the desired StableDiffusion API payload in: `public\js\scripts\sd.js`
4. If you want to use your own images, set them in `sd-interactive\images\input` and `sd-interactive\images\preview` and make sure they have the same resolution as the POST request sends.
5. Download [EasyNegative](https://civitai.com/models/7808/easynegative) and place the embeddings for negative prompts in path: `C:\your-local-directory\stable-diffusion-webui\embeddings`
6. Download [monet](https://civitai.com/images/375698?modelId=21482&postId=81508&id=21482&slug=claude-monet-painting-style) and place the lora in path: `C:\your-local-directory\stable-diffusion-webui\models\Lora`

<br>

## Start application
1. Run `npm run dev` to start the application
2. When developing, run `npm run scss` to start SASS watch (CSS compiler)

<br>

## DEV: notes
- IMPORTANT: in `public\js\scripts\sd.js`, set `save_images: true` to false in the payload to prevent automatic savings of generated results
- Gradio removed the possibility to use the webui and API documentation at the same time
- If you want to read the API documentation, make sure to add `--nowebui` to the COMMANDLINE_ARGS.
- Make sure to check the port number, this might swap between :7860 and :7861

<br>

## DEV: TODO
The code has been thoughtfully commented to provide clarity on the purpose and functionality of each code segment. Additionally, below is listed which parts of the code need to be improved to keep it maintainable and scalable.

1. Improve the Stable Diffusion API payload; alignment of input image, ControlNet parameters, research new preprocessors, possibility to create a LoRA which suites the diresed style and use the latest style transferring methods.
2. Add functionality to language switch overlay.
3. Add information to corrosponding state to infoOverlay.
4. Remove unused code in app.js (no need for looping through multiple Displays).
5. Handle the end/stop of the application in app.js by resetting the application, instead of reloading both screens.
6. When the users grants permission, save the result locally and fetch it in Display attract screen function.
7. Prevent duplicated images in the attract state of Display.
8. Change (S)CSS according to desired design of client.
9. Minor bug: when updating the image at the Discover state, the swap causes a very little flash (need to pre-load image).
10. Encapsulate and move code to own object/functions (or even files) to keep it modular.
11. Remove unused commented-out code.

It is also recommended to use a high-quality webcam for the best results.