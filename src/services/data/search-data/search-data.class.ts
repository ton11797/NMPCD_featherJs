import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class SearchData implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data: any, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let debug = this.app.get('debug')
    // debug.logging(1,"test","test")
    // debug.logging(7,"test","test")
    // debug.logging(12,"test","test")
    // debug.logging(99,"test","test")
    let {schemaName,versionUUID,condition} = data
    let client:any =  await this.app.get('postgresClient')
    // await client.query('BEGIN')
    let where = ''
    let conditionKey = Object.keys(condition)
    for(let i=0;i<conditionKey.length;i++){
      if(where === ''){
        where = `${where} ${conditionKey[i]} = '${condition[conditionKey[i]]}'`
      }else{
        where = `${where} AND ${conditionKey[i]} = '${condition[conditionKey[i]]}'`
      }
    }
    console.log(`SELECT * FROM ${schemaName}_${versionUUID} WHERE ${where}`)
    let searchData = await client.query(`SELECT * FROM "${schemaName}_${versionUUID}" WHERE ${where}`)
    return searchData;
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
