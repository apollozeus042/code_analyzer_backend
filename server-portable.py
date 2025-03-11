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
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)
port = "5000"

# Get the directory where the script is located
SCRIPT_DIR = Path(__file__).parent.absolute()

# Set up paths relative to the script location
MODELS_DIR = SCRIPT_DIR / "models"
os.makedirs(MODELS_DIR, exist_ok=True)

# Check operating system and set Tesseract path accordingly
import platform
if platform.system() == "Windows":
    # Default Windows Tesseract path - modify if needed
    tesseract_path = r"C:/Program Files/Tesseract-OCR/tesseract.exe"
    if os.path.exists(tesseract_path):
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
    else:
        print("WARNING: Tesseract not found at default location. Please install Tesseract or update the path.")
# For macOS/Linux, Tesseract should be in PATH

# Model paths
READABILITY_MODEL_PATH = MODELS_DIR / "readability_model.keras"
BUGLOCAL_MODEL_PATH = MODELS_DIR / "buglocalize_model.keras"
LABEL_ENCODER_PATH = MODELS_DIR / "label_encoder.joblib"

# Check if models exist
models_exist = (
    os.path.exists(READABILITY_MODEL_PATH) and 
    os.path.exists(BUGLOCAL_MODEL_PATH) and 
    os.path.exists(LABEL_ENCODER_PATH)
)

if not models_exist:
    print(f"WARNING: Models not found in {MODELS_DIR}")
    print(f"Please copy your models to this directory or update the paths in the code.")
    print("For now, using dummy predictions for demonstration.")

# Load models if they exist
custom_objects = {'LeakyReLU': LeakyReLU}
try:
    if os.path.exists(READABILITY_MODEL_PATH):
        readability_model = load_model(READABILITY_MODEL_PATH, custom_objects=custom_objects)
    else:
        readability_model = None
        
    if os.path.exists(BUGLOCAL_MODEL_PATH):
        buglocal_model = load_model(BUGLOCAL_MODEL_PATH)
    else:
        buglocal_model = None
        
    if os.path.exists(LABEL_ENCODER_PATH):
        label_encoder = joblib.load(LABEL_ENCODER_PATH)
    else:
        label_encoder = None
except Exception as e:
    print(f"Error loading models: {e}")
    readability_model = None
    buglocal_model = None
    label_encoder = None

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
    if readability_model is None:
        # Return dummy prediction if model doesn't exist
        print("Using dummy readability prediction")
        return 1
        
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
    if buglocal_model is None or label_encoder is None:
        # Return dummy prediction if models don't exist
        print("Using dummy bug localization prediction")
        return "SyntaxError"
        
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
    return predicted_error[0]

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"}), 200

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
            bug_identified = bug_localization(extracted_text)
            return jsonify({"extracted_text": extracted_text, "readability": int(readability_score), "bugs": bug_identified})

    elif "code" in request.form:
        code = request.form["code"]
        readability_score = readability(code)
        bug_identified = bug_localization(code)
        return jsonify({"extracted_text": code, "readability": int(readability_score), "bugs": bug_identified})

    return jsonify({"error": "No valid input provided"}), 400

if __name__ == "__main__":
    print(f"Server starting on http://localhost:{port}")
    print(f"Models directory: {MODELS_DIR}")
    if not models_exist:
        print("WARNING: Models not found. Using dummy predictions.")
    app.run(debug=True, host="0.0.0.0", port=int(port))

