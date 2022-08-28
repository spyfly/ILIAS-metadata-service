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

@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    doc = request.data.decode('utf8')
    extracted_keywords = kw_model.extract_keywords(doc, stop_words=german_stop_words, use_maxsum=True, nr_candidates=20, top_n=5)
    json_response = json.dumps(extracted_keywords)
    return Response(json_response, mimetype='application/json')