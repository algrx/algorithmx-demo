# === setup python ===
FROM python:3.7 as setup-python
COPY ./brython /app/brython
WORKDIR /app

# install depencencies
RUN python -m pip install --upgrade pip \
&& python -m pip install -r /app/brython/requirements.txt


# === create brython bundle ===
FROM setup-python as build-python
WORKDIR /app/brython
RUN ./build.sh


# === setup js ===
FROM node:11 as setup-js
WORKDIR /app

COPY ./src ./src
COPY ./tsconfig.json .
COPY ./webpack.config.ts .
COPY ./package*.json ./
COPY ./brython/version.json ./brython/

# install depencencies
RUN npm ci

# copy built brython
COPY --from=build-python /app/brython/dist ./brython/dist
