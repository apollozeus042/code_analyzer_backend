# **Code Analyzer**

A **Web Application** for analyzing code readability and detecting bugs using **Tesseract OCR and CNN models**.

---

## 🚀 **Getting Started**  

### ✅ **Prerequisites**  
Before running the project, ensure you have the following installed:

### **1️⃣ Python 3.12 or Lower**  
Check if Python is installed by running:  
```sh
python --version
```
If Python is not installed or you have a higher version, download **Python 3.12 or lower** from [python.org](https://www.python.org/downloads/).

### **2️⃣ Install Tesseract OCR**  
1. Download and install **Tesseract OCR** from:  
   🔗 [Tesseract OCR Installer (UB-Mannheim Github wiki)](https://github.com/UB-Mannheim/tesseract/wiki)  
2. **Update Tesseract Path** (if needed) in `server.py` (Line 22):  
   ```python
   pytesseract.pytesseract.tesseract_cmd = r"{path-to-tesseract}/tesseract.exe"
   ```

---

## 🔧 **Installation**

### **📌 1. Navigate to the Project Directory**
Ensure you're inside the correct project folder:  
```sh
cd path/to/your/code-analyzer
```

### **📌 2. Install Required Dependencies**
Run the following command to install all necessary Python packages:  
```sh
py -3.11 -m pip install -r requirements.txt
```
✅ **Replace `-3.11` with your installed valid Python version if needed.**  

---

## 🚀 **Running the Flask Server**
Start the Flask API by running:  
```sh
py -3.11 server.py
```
✅ This will launch the server, and logs will appear in the terminal.

✅ You will see a "WEB APPLICATION IS CONNECTED TO SERVER" message in the terminal if successful.

---

## 🌍 **Access the Web App**
Once the backend is running, open the frontend web app:  
🔗 **[Code Analyzer Vercel Web App](https://codeanalyzerv2.vercel.app/)**  

---

## 📝 **Logging & Debugging**
- **Terminal logs** will show how the image is read and fed into the model.
- If any errors occur, check the logs for missing dependencies or incorrect file paths.

---

## 📌 **Troubleshooting & Notes**
- If Tesseract OCR is not detected, check that the installation path is correctly set in `server.py`.
- If you encounter issues with dependencies, try upgrading `pip`:
  ```sh
  python -m pip install --upgrade pip
  ```
- If the server doesn't start, ensure you're using the correct Python version (`py -3.11`).
- For other concerns, try contacting the developers: Apollo Zeus Espinosa or Rafael Ogot
---

## 🎯 **Summary**
✔️ **Install Python & Tesseract OCR**  
✔️ **Navigate to the project folder**  
✔️ **Install dependencies using `requirements.txt`**  
✔️ **Run the Flask server (`py -3.11 server.py`)**  
✔️ **Access the web app [here](https://codeanalyzerv2.vercel.app/)**  

