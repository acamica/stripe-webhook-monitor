FROM node:8.9.1-alpine

WORKDIR /usr/src

COPY package.json package-lock.json ./
RUN npm install --production

COPY server.js ./
COPY public public

CMD npm start --production
