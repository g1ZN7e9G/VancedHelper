FROM node:13.6.0-stretch-slim
LABEL maintainer="xfileFIN"
WORKDIR /src

COPY package.json /src/package.json
RUN apt-get update && apt-get install -y ffmpeg libtool autoconf make g++ python3
RUN npm install --loglevel error

COPY . /src

CMD npm start
