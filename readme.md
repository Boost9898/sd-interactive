## Installation Stable Diffusion and dependencies
Make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies) are met and follow the instructions available for [NVidia](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs) GPUs.

### Installation on Windows 10/11 with NVidia-GPUs using release package
1. Download `sd.webui.zip` from [v1.0.0-pre](https://github.com/AUTOMATIC1111/stable-diffusion-webui/releases/tag/v1.0.0-pre) and extract it's contents
2. Run `update.bat` to fetch the latest version
3. Run `run.bat`
> For more details see [Install-and-Run-on-NVidia-GPUs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs)

### Automatic Installation on Windows
1. Install [Python 3.10.6](https://www.python.org/downloads/release/python-3106/) (Newer version of Python does not support torch), checking "Add Python to PATH".
2. Install [git](https://git-scm.com/download/win).
3. Download the stable-diffusion-webui repository, by running `git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`.
4. Add the following arguments to `webui-user.bat`
```bash
set COMMANDLINE_ARGS=--xformers --medvram --cors-allow-origins=* --api --nowebui
```
1. Run `webui-user.bat` from Windows Explorer

### Explaination of commandline arguments:
- xformers: imrpove speed of generation process
- medvram: makes the system use less GPU VRAM
- cors: allow cross origin usage
- api: enables api (api documentation is accessible on: [http://127.0.0.1:7861/docs](http://127.0.0.1:7861/docs))
- nowebui: disables webui (remove this argument to enable webui, note that this will disable the API, accessible on: [http://127.0.0.1:786](http://127.0.0.1:7860)

<br><br>

## Installation ControlNet
Install ControlNet using the Make sure the required [dependencies](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Dependencies)

1. Open "Extensions" tab
2. Open "Install from URL" tab in the tab
3. Enter `https://github.com/Mikubill/sd-webui-controlnet.git` to "URL for extension's git repository"
4. Press "Install" button
5. Wait, you will see the message "Installed into stable-diffusion-webui\extensions\sd-webui-controlnet. Use Installed tab to restart"
6. Go to "Installed" tab, click "Check for updates", and then click "Apply and restart UI". (The next time you can also use these buttons to update ControlNet.)
7. Completely restart A1111 webui including your terminal
8. Download models (see below)
9. After you put models in the correct folder, you may need to refresh to see the models

### Download and install models
1. Download the models from ControlNet 1.1: https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main, you need to download model files ending with ".pth".
2. Put models in your "stable-diffusion-webui\extensions\sd-webui-controlnet\models". You only need to download "pth" files.










### Setup
 - Update project name in package.json + package-lock.json
 - Run "npm install"
 - Update path in sass-watch.bat to root of project folder

### Input images resolution
Make sure images in `sd-interactive\images\input` have the same resolution as the POST request sends

### SETUP: Install ControlNet models
- https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main
- click on the three dots upper right corner
- click on clone repository
- run the first line (if never executed before)
- run 'git clone' line in the following folder: C:\Projects\sd\stable-diffusion-webui\models\ControlNet
- Note: terminal does not update it's status, wait until cursor is back
- Move all the cloned content up by one folder

### SETUP: Requirements
- ControlNet: https://github.com/Mikubill/sd-webui-controlnet (Path: stable-diffusion-webui\extensions\sd-webui-controlnet\models)
- Embeddings for negative prompts, path: C:\your-local-directory\stable-diffusion-webui\embeddings

## DEV: fix API
run the line below to start the application
- npm run dev
run the line below to watch scss
- npm run scss

## DEV notes
- Gradio removed the possibility to use the webui and API documentation at the same time.
- If you want to read the API dcoumation, make sure to add `--nowebui` to the COMMANDLINE_ARGS. 
- Make sure to check the port number, this might swap between :7860 and :7861