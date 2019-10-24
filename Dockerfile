FROM node:10-alpine
RUN npm install pm2 -g

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run compile
EXPOSE 3030


CMD ["node", "./lib"]