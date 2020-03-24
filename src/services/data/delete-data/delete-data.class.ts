import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {
  versionUUID:string,
  schemaName:string,
  uuid:string
}

interface ServiceOptions {}

export class DeleteData implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get (id: Id, params?: Params): Promise<any> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data: any, params?: Params,confirm?:boolean): Promise<any> {
    const config =  await (await this.app.get('mongoClient')).collection("system").findOne({})
    if(!config.confirmation.allowInsertWithoutConfirm){
      if(!confirm){
        const confirm_service = this.app.service('data/delete-confirm');
        await confirm_service.create(data)
        return {
          result:"wait for confirm"
        }
      }
    }
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","delete-data")
    let {versionUUID,schemaName,uuid} = data
    let client:any = await this.app.get('postgresClient')
    let result = await client.query(`DELETE FROM "${schemaName}_${versionUUID}" WHERE _uuid = '${uuid}'`) 
    delete result.command
    delete result.oid
    delete result._parsers
    delete result._types
    delete result.RowCtor
    delete result.rowAsArray
    return result;
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove (id: NullableId, params?: Params): Promise<any> {
    return { id };
  }
}
