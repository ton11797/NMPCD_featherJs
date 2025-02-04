// @ts-ignore
import { parseConnectionString as parse } from 'mongodb-core';
import { MongoClient } from 'mongodb';
import { Application } from './declarations';
// const logger = require('./logger');

export default function (app: Application) {
  const config = app.get('mongodb');
  const promise = MongoClient.connect(config, { useNewUrlParser: true }).then(client => {
    const dbName =app.get('mongodbDatabase');
    return client.db(dbName);
  }).catch(error => {
    console.log(error)
    // logger.error(error);
  });

  app.set('mongoClient', promise);
}
