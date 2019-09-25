import  { Pool, Client } from 'pg'
import db_config from '../Config/database'
export default class {
    constructor(){
        this.pool = new Pool(db_config.postgres)
    }
    open(){
        return new Promise((resolve, reject) => {
            let con = this.pool.connect()
            resolve(con)
        })
    }
}