import { MongoClient } from 'mongodb';
import app from '../app';
export default class {
    DB!: MongoClient;
    async connectDB(){
        this.DB = await MongoClient.connect(await app.get('mongodb'), { useNewUrlParser: true })
    }
    async closeDB(){
        this.DB.close()
    }
}