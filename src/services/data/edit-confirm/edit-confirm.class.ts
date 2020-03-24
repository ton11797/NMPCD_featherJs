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

export class EditConfirm implements ServiceMethods<Data> {
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

  async create (data: Data|Data[], params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","edit-confirm") 
    let {versionUUID,schemaName,uuid} = data
    let updateData:any = data.data
    let result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})
    if(result === null)throw new BadRequest("versionUUID not found")
    if(result.schema[schemaName] === undefined)throw new BadRequest("schemaName not found")
    let column = ""
    let columnUpdate = ""
    for(let i=0;i<result.schema[schemaName].length;i++){
      if(updateData[result.schema[schemaName][i].fieldName] !== undefined){
        columnUpdate = `${columnUpdate} ,'${updateData[result.schema[schemaName][i].fieldName]}' as ${result.schema[schemaName][i].fieldName} `
      }else{
        columnUpdate = `${columnUpdate} ,${result.schema[schemaName][i].fieldName} `
      }
      column = `${column} ,${result.schema[schemaName][i].fieldName} `
    }
    let sql = `INSERT INTO "${schemaName}_${versionUUID}_c" (_uuid${column},_count,_user,_approved,_action,_status)
    SELECT _uuid${columnUpdate} ,0 as _count ,'{}' as _user,0 as _approved, 1 as _action ,0 as _status FROM "${schemaName}_${versionUUID}"
    WHERE _uuid = '${uuid}'
    `
    debug.logging(99,"data-link","postgres "+sql)
    let client:any = await this.app.get('postgresClient')
    await client.query(sql) 
    return {result:"success"};
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
