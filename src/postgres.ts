// @ts-ignore
import  { Pool, Client,PoolClient } from 'pg'
import { Application } from './declarations';
// const logger = require('./logger');

export default function (app: Application) {
    const pool = new Pool({connectionString:app.get("postgres")})
    const config = app.get('mongodb');
    const promise = new Promise((resolve, reject) => {
    let con = pool.connect()
    resolve(con)
})
  app.set('postgresClient', promise);
}
