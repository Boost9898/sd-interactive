Make sure to set the following flags in 'webui-user.bat' of StableDiffusion,
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set SAFETENSORS_FAST_GPU=1
set COMMANDLINE_ARGS=--xformers --medvram --cors-allow-origins=* --api

call webui.bat

<!--  -->

Make sure images in `sd-interactive\images\input` have the same resolution as the POST request sends

## Setup

 - Update project name in package.json + package-lock.json
 - Run "npm install"
 - Update path in sass-watch.bat to root of project folder