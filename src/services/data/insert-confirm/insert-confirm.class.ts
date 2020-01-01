import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { BadRequest } from '@feathersjs/errors';
import uuidv1 from 'uuid/v1'
interface Data {}

interface ServiceOptions {}

export class InsertConfirm implements ServiceMethods<Data> {
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
    debug.logging(1,"API_call","insert-confirm")
    let {versionUUID,schemaName,value} = data
    let result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})
    if(result === null)throw new BadRequest("versionUUID not found")
    if(result.schema[schemaName] === undefined)throw new BadRequest("schemaName not found")
    for(let i=0;i<result.schema[schemaName].length;i++){
      if(value[result.schema[schemaName][i].fieldName] === undefined)throw new BadRequest(`field value ${result.schema[schemaName][i].fieldName} not found`)
    }
    let insert =""
    let insert_col =""
    let uuid = uuidv1();
    for(let i=0;i<result.schema[schemaName].length;i++){
      insert_col = `${insert_col} ,${result.schema[schemaName][i].fieldName}`
      insert = `${insert} ,'${value[result.schema[schemaName][i].fieldName]}'`
    }
    if(insert !== ""){
      insert = insert.substr(2)
      insert_col = insert_col.substr(2)
      let client:any = await this.app.get('postgresClient')
      await client.query('BEGIN')
      await client.query(`INSERT INTO "${schemaName}_${versionUUID}_c" (${insert_col},_uuid,_count,_user,_status,_action,_approved) VALUES (${insert},'${uuid}',0,'{}',0,0,0)`) 
      await client.query('COMMIT')
    }else{

    }
    return data;
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
