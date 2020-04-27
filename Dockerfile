# === create brython bundle ===
FROM python:3.7 as install-python
COPY ./brython /app/brython
WORKDIR /app
RUN python -m pip install -r ./brython/requirements.txt

# === build website ===
FROM node:11 as install-js
COPY . /app
WORKDIR /app
RUN npm ci

