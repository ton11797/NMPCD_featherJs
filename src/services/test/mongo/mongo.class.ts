import { Db } from 'mongodb';
import { Service, MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../../declarations';
export class Mongo extends Service {

  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options);
    const client: Promise<Db> = app.get('mongoClient');
    client.then(db => {
      this.Model = db. collection('users');
    });
  }
};
