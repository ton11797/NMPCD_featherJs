import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { BadRequest } from '@feathersjs/errors';
import neo4jDB from '../../../DAL/neo4j'
import uuidv1 from 'uuid/v1'
import querystring from 'querystring';
interface Data {}

interface ServiceOptions {}
interface ServiceMethods<T> {
  [key: string]: any;
  create (data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
}
export class Insert implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;
  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }
  async create (data: any, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
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
    data.uuid =uuid 
    let para =[]
    for(let i=0;i<result.schema[schemaName].length;i++){
      insert_col = `${insert_col} ,${result.schema[schemaName][i].fieldName}`
      // insert = `${insert} ,'${value[result.schema[schemaName][i].fieldName]}'`
      insert = `${insert} , $${(i+1)}`
      para.push(value[result.schema[schemaName][i].fieldName])
    }
    if(insert !== ""){
      insert = insert.substr(2)
      insert_col = insert_col.substr(2)
      let client:any = await this.app.get('postgresClient')
      await client.query('BEGIN')
      // console.log(`INSERT INTO "${schemaName}_${versionUUID}" (${insert_col},_uuid) VALUES (${insert},'${uuid}')`)
      await client.query(`INSERT INTO "${schemaName}_${versionUUID}" (${insert_col},_uuid) VALUES (${insert},'${uuid}')`,para) 
      let neo = await this.app.get('neo4jDB')  
      let version = versionUUID.replace(/-/g,"")
      await neo.run(`CREATE (:_data:_${schemaName}:_${version} {Param})`,{Param:{uuid}})
      await client.query('COMMIT')
      
    }else{

    }
    return data;
  }

}
