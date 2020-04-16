import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class Config implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    const result = await (await this.app.get('mongoClient')).collection("system").findOne({})
    return result
  }
  
  async get (id: Id, params?: Params): Promise<Data> {
    return []
  }

  async create (data: any, params?: Params): Promise<Data> {
    delete data._id
    data.confirmation.confirmationRequire = parseInt(data.confirmation.confirmationRequire)
    data.confirmation.rejectThreshold = parseInt(data.confirmation.rejectThreshold)
    const newconfig = {$set:data}
    const result = await (await this.app.get('mongoClient')).collection("system").updateOne({},newconfig)
    return result
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove (id: NullableId, params?: Params): Promise<Data> {
    return { id };
  }
}
