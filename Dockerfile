FROM node:10-alpine
RUN npm install pm2 -g

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install
RUN npm compile

COPY --chown=node:node . .

EXPOSE 3030
CMD ["pm2-runtime", "./lib/index.js"]