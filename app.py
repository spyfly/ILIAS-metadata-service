# Init Flask
from flask import Flask
from flask import request
from flask import Response
app = Flask(__name__)

# Init KeyBERT
from keybert import KeyBERT
kw_model = KeyBERT(model='paraphrase-multilingual-MiniLM-L12-v2')

# Init NTLK for Stopword Removal
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
german_stop_words = stopwords.words('german')

# JSON Lib
import json 

# Tensorflow Setup
import numpy as np
import time

import PIL.Image as Image
import matplotlib.pylab as plt

import tensorflow as tf
import tensorflow_hub as hub

import datetime

# Tensorflow Model Setup
IMAGE_SHAPE = (224, 224)
classifier = tf.keras.applications.NASNetMobile(
    input_shape=(224, 224, 3),
    include_top=True,
    weights="imagenet",
    input_tensor=None,
    pooling=None,
    classes=1000,
    classifier_activation="softmax",
)

import requests
import tempfile

# Tesseract
import pytesseract

@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    doc = request.data.decode('utf8')
    extracted_keywords = kw_model.extract_keywords(doc, stop_words=german_stop_words, use_maxsum=True, nr_candidates=20, top_n=5)
    json_response = json.dumps(extracted_keywords)
    return Response(json_response, mimetype='application/json')

@app.route('/process_image', methods=['POST'])
def process_image():
    img_url = request.values.get('url')
    session_id = request.values.get('sessionId')
    
    # Download Image
    headers={'Cookie': 'PHPSESSID=' + session_id}
    r=requests.get(img_url, headers=headers)
    img_path = tempfile.NamedTemporaryFile().name
    open(img_path, 'wb').write(r.content)

    # Resize Image for Mobilenet model
    img = Image.open(img_path).convert("RGB")
    resized_img = img.resize(IMAGE_SHAPE)

    img_array = np.array(resized_img)/255.0
    print(img_array.shape)

    # Predict Content
    result = classifier.predict(img_array[np.newaxis, ...])
    predictions_decoded = tf.keras.applications.nasnet.decode_predictions(
        result, top=5
    )

    # Convert Result
    response = {}
    for (id, name, propability) in predictions_decoded[0]:
        print(str(name) + ": " + str(propability))
        response[name] = str(propability)

    # Run OCR
    ocr = pytesseract.image_to_string(img, config=r'-l deu+eng')

    json_response = json.dumps({
        'classification': response,
        'ocr': ocr
    })
    return Response(json_response, mimetype='application/json')