// @ts-ignore
import  { Pool, Client,PoolClient } from 'pg'
import { Application } from './declarations';
import neo4j from 'neo4j-driver'
import neo4jDB from './DAL/neo4j'
// const logger = require('./logger');

export default function (app: Application) {
    const db_config = {neo4j:app.get('neo4j')};
    let DB = neo4j.driver(db_config.neo4j.connection, neo4j.auth.basic(db_config.neo4j.username, db_config.neo4j.password),{maxTransactionRetryTime: 30000});
    const promise = new Promise((resolve, reject) => {
        let session = DB.session();
        resolve(session)
      })
    app.set('neo4jDB', promise);
}
