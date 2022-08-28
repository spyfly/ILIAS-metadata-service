# ILIAS-metadata-service

## Metadata Service Setup

1. Install NodeJS v16
2. Install packages using `npm i`
3. Copy `example-config.json` to `config.json` and adjust the parameters accordingly.

## Keyword Service Setup
1. Install Python3, Python3-venv and PIP
2. Create a new Python venv using `python3 -m venv venv`
3. Activate the venv using `. venv/bin/activate`
4. Install KeyBERT and Flask using `pip3 install Flask keybert`

## Usage

1. Start the keyword service with `flask run --host=127.0.0.1 -p 5001`
2. Start the metadata service application via `npm start`
3. Visit `http://localhost:3000/api-docs/` to access Swagger UI

## Resolving Pytorch issues with modern NVIDIA GPUs

1. Check the currently installed CUDA Version with `nvidia-smi`
2. Uninstall the currently installed pytorch packages with `pip3 uninstall torch torchvision torchaudio`
3. Install the latest nightly PyTorch build for your CUDA Version with `pip3 install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu117` (Replace `cu117` with your installed CUDA Version here, `cu117` equals CUDA Version `11.7`)