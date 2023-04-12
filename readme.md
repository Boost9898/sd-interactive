Make sure to set the following flags in 'webui-user.bat' of StableDiffusion,
@echo off

set PYTHON=
set GIT=
set VENV_DIR=
set SAFETENSORS_FAST_GPU=1
set COMMANDLINE_ARGS=--xformers --medvram --cors-allow-origins=* --api

call webui.bat
