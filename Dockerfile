FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g 
COPY . .
RUN npm run compile
EXPOSE 3030

CMD ["pm2-runtime", "./lib/index.js"]