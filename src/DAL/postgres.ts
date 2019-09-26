import  { Pool, Client,PoolClient } from 'pg'
import app from '../app';
export default class {
    pool:any
    constructor(){
        this.pool = new Pool({connectionString:app.get("postgres")})
    }
    open(){
        return new Promise((resolve, reject) => {
            let con = this.pool.connect()
            resolve(con)
        })
    }
}