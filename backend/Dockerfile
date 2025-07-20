FROM python:3.12.5-slim

WORKDIR /usr/src/app

# Install pip and system dependencies`
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and wheel
RUN pip install --upgrade pip setuptools wheel

# Optional: Clear pip cache (for fresh version info)
RUN pip cache purge

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=app

CMD flask db upgrade && flask run --host=0.0.0.0 --port=5000
