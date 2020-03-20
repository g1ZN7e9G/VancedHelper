FROM node:13.10-stretch-slim
LABEL maintainer="xfileFIN"
WORKDIR /src

COPY package.json /src/package.json
RUN npm install --loglevel error

COPY . /src

CMD npm run start
