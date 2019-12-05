// @ts-ignore
import  { Pool, Client,PoolClient } from 'pg'
import { Application } from './declarations';
import neo4jDB from './DAL/neo4j'
// const logger = require('./logger');

export default function (app: Application) {
    let promise = new neo4jDB()
    app.set('neo4jDB', promise);
}
