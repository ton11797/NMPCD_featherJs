import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { BadRequest } from '@feathersjs/errors';
interface Data {
  versionUUID:string,
  schemaName:string,
  uuid:string,
  data:object
}

interface ServiceOptions {}

export class EditData implements ServiceMethods<Data> {
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

  async create (data: Data|Data[], params?: Params,confirm?:boolean): Promise<any> {
    const config =  await (await this.app.get('mongoClient')).collection("system").findOne({})
    if(!config.confirmation.allowInsertWithoutConfirm){
      if(!confirm){
        const confirm_service = this.app.service('data/edit-confirm');
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
    debug.logging(1,"API_call","edit-data") 
    let {versionUUID,schemaName,uuid } = data
    let updateData:any = data.data
    let result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})
    if(result === null)throw new BadRequest("versionUUID not found")
    if(result.schema[schemaName] === undefined)throw new BadRequest("schemaName not found")
    let update =""
    for(let i=0;i<result.schema[schemaName].length;i++){
      if(updateData[result.schema[schemaName][i].fieldName.toLowerCase()] !== undefined){
        update = `${update} ,${result.schema[schemaName][i].fieldName.toLowerCase()} = '${updateData[result.schema[schemaName][i].fieldName.toLowerCase()]}'`
      }
    }
    update = update.substr(2)
    let query = `UPDATE "${schemaName}_${versionUUID}"
    SET ${update}
    WHERE _uuid = '${uuid}'`
    debug.logging(99,"edit-data","postgress "+query)
    let client:any = await this.app.get('postgresClient')
    let resultQ = await client.query(query) 
    delete resultQ.command
    delete resultQ.oid
    delete resultQ._parsers
    delete resultQ._types
    delete resultQ.RowCtor
    delete resultQ.rowAsArray
    return resultQ;
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
