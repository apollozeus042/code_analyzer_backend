from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
import pandas as pd
import string
import tokenize
from io import BytesIO
import ast
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import LeakyReLU
from keras.models import load_model
import numpy as np
from sklearn.preprocessing import LabelEncoder
import joblib

app = Flask(__name__)
CORS(app)
port = "5000"
# Set the path to Tesseract (Windows only)
# Uncomment the line below and update the path if needed
pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

custom_objects = {'LeakyReLU': LeakyReLU}
readability_model= load_model("D:/Documents/Schoo/School Activities/4th Year/Intelligent Sytems/code_analyzer/src/backend/models/readability_model.keras", custom_objects=custom_objects)
buglocal_model=load_model("D:/Documents/Schoo/School Activities/4th Year/Intelligent Sytems/code_analyzer/src/backend/models/buglocalize_model.keras")
label_encoder= joblib.load('D:/Documents/Schoo/School Activities/4th Year/Intelligent Sytems/code_analyzer/src/backend/models/label_encoder.joblib')

char_vocab = {char: idx for idx, char in enumerate(string.ascii_letters + string.digits + string.punctuation + " ", start=1)}
def char_to_int(code):
    return [char_vocab.get(char, 0) for char in code]  # 0 for unknown characters

token_vocab = {}
def tokenize_code(code):
    tokens = []
    try:
        code_bytes = BytesIO(code.encode('utf-8'))
        for token in tokenize.tokenize(code_bytes.readline):
            token_str = token.string
            if token_str not in token_vocab:
                token_vocab[token_str] = len(token_vocab) + 1  # Assign a new index
            tokens.append(token_vocab[token_str])
    except:
        tokens.append(0)  # Handle errors
    return tokens

ast_vocab = {}  # Will be filled dynamically
def ast_nodes(code):
    try:
        tree = ast.parse(code)
        nodes = [type(node).__name__ for node in ast.walk(tree)]
        node_indices = []
        for node in nodes:
            if node not in ast_vocab:
                ast_vocab[node] = len(ast_vocab) + 1  # Assign a new index
            node_indices.append(ast_vocab[node])
        return node_indices
    except:
        return [0] 

def readability(extracted_text):
    new_data = {'python_solutions': [extracted_text]}
    new_df = pd.DataFrame(new_data)

    new_df["char_representation"] = new_df["python_solutions"].apply(char_to_int)
    new_df["token_representation"] = new_df["python_solutions"].apply(tokenize_code)
    new_df["node_representation"] = new_df["python_solutions"].apply(ast_nodes)

    X_char_new = pad_sequences(new_df["char_representation"], maxlen=20000)
    X_token_new = pad_sequences(new_df["token_representation"], maxlen=4000)
    X_ast_new = pad_sequences(new_df["node_representation"], maxlen=2000)

    prediction = readability_model.predict([X_char_new, X_token_new, X_ast_new])
    readability = (prediction > 0.5).astype(int)

    print("Predicted Readability:", readability[0][0])
    return readability[0][0]

def bug_localization(extracted_text):
    new_data = {'python_solutions': [extracted_text]}
    new_df = pd.DataFrame(new_data)

    # 2. Preprocess the code snippet (same as before)
    new_df["char_representation"] = new_df["python_solutions"].apply(char_to_int)
    new_df["token_representation"] = new_df["python_solutions"].apply(tokenize_code)

    # 3. Prepare data for the model (same as before)
    X_char_new = pad_sequences(new_df["char_representation"], maxlen=1024)
    X_token_new = pad_sequences(new_df["token_representation"], maxlen=361)

    # 4. Make the prediction
    prediction = buglocal_model.predict([X_char_new, X_token_new])
    predicted_class = np.argmax(prediction)
    predicted_error = label_encoder.inverse_transform([predicted_class])

    # 5. Print the prediction
    print("Predicted Error Type:", predicted_error[0])
    predicted_error = map_predicted_error(predicted_error[0])
    return predicted_error

def map_predicted_error(predicted_error):
    error_map = {
        "TLE": "Time Limit Exceeded",
        "0": "No bug found",
        "TypeError": "TypeError",
        "ValueError": "ValueError",
        "IndexError": "IndexError",
        "AttributeError": "AttributeError",
        "EOFError": "End of File",
        "ModuleNotFoundError": "ModuleNotFoundError",
        "ZeroDivisionError": "ZeroDivisionError",
        "KeyError": "KeyError",
        "ImportError": "ImportError",
        "OverflowError": "Overflow",
        "FileNotFoundError": "FileNotFoundError",
        "RecursionError": "RecursionError",
        "SyntaxError": "SyntaxError",
        "NameError": "NameError",
        "MLE": "Maximum Likelihood Estimation",
        "RuntimeError": "RuntimeError",
        "UnboundLocalError": "UnboundLocalError",
        "1": "Unknown Error",
    }

    # If predicted_error is a list or array, extract the first element
    if isinstance(predicted_error, (list, np.ndarray)):
        predicted_error = predicted_error[0]  

    # Perform dictionary lookup
    mapped_label = error_map.get(predicted_error, "Unknown Error")
    print("Predicted Error Type:", mapped_label)  # Debugging output
    return mapped_label


@app.route("/upload", methods=["POST"])
def analyze_code():
    if "file" in request.files:
        file = request.files["file"]
        if file.filename.endswith((".png", ".jpg", ".jpeg")):
            print("File Retrieved")
            img = Image.open(file)
            extracted_text = pytesseract.image_to_string(img)
            print(extracted_text)
            readability_score = readability(extracted_text)
            bug_identified= bug_localization(extracted_text)
            return jsonify({"extracted_text": extracted_text, "readability": int(readability_score), "bugs":bug_identified})

    elif "code" in request.form:
        extracted_text= request.form.get("code")
        print(extracted_text)
        readability_score = readability(extracted_text)
        bug_identified= bug_localization(extracted_text)
        return jsonify({"extracted_text": extracted_text, "readability": int(readability_score), "bugs":bug_identified})

    return jsonify({"error": "No valid input provided"}), 400


if __name__ == "__main__":
    app.run(debug=True)
