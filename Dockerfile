FROM node:10
RUN npm install pm2 -g

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3030
RUN npm compile

CMD ["node", "./lib"]