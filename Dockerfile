FROM node:12
MAINTAINER xfileFIN

COPY package.json /src/package.json
RUN cd /src && npm install --loglevel error
RUN apt-get update

COPY . /src
WORKDIR /src

CMD npm run start