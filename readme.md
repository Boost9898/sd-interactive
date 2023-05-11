## Setup Make sure to set the following flags in 'webui-user.bat' of StableDiffusion,
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set SAFETENSORS_FAST_GPU=1
set COMMANDLINE_ARGS=--xformers --medvram --cors-allow-origins=* --api --nowebui

call webui.bat

## Setup
 - Update project name in package.json + package-lock.json
 - Run "npm install"
 - Update path in sass-watch.bat to root of project folder

## Input images resolution
Make sure images in `sd-interactive\images\input` have the same resolution as the POST request sends

## SETUP: Install ControlNet models
- https://huggingface.co/lllyasviel/ControlNet-v1-1/tree/main
- click on the three dots upper right corner
- click on clone repository
- run the first line (if never executed before)
- run 'git clone' line in the following folder: C:\Projects\sd\stable-diffusion-webui\models\ControlNet
- Note: terminal does not update it's status, wait until cursor is back
- Move all the cloned content up by one folder

## SETUP: Requirements
- ControlNet: https://github.com/Mikubill/sd-webui-controlnet (Path: stable-diffusion-webui\extensions\sd-webui-controlnet\models)
- Embeddings for negative prompts, path: C:\your-local-directory\stable-diffusion-webui\embeddings

## DEV: fix API
run the line below to start the application
- npm run dev
run the line below to watch scss
- npm run scss

## DEV: fix API
- Gradio removed the possibility to use the webui and API documentation at the same time.
- If you want to read the API dcoumation, make sure to add `--nowebui` to the COMMANDLINE_ARGS. 
- Make sure to check the port number, this might swap between :7860 and :7861
- It is still possible to use the webui and API at the same time