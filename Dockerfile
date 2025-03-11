# Use Python 3.9 as base image
FROM python:3.11

# Install system dependencies (including Tesseract OCR)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Set Tesseract path (Linux)
ENV TESSDATA_PREFIX=/usr/share/tesseract-ocr/4.00/tessdata

# Set the working directory
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose port 5000 for Flask
EXPOSE 5000

# Run the application
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "server:app"]
