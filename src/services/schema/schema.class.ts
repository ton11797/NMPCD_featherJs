import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { BadRequest } from '@feathersjs/errors';
import neo4jDB from '../../DAL/neo4j'
import { threadId } from 'worker_threads';
interface Data {

}
interface ServiceOptions {}
export class Schema implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;
  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }
  async find (params?: Params): Promise<any> {
    let result =  await (await this.app.get('mongoClient')).collection("Schema").find({}).toArray()    
    return {result};
  }

  async get (id: Id, params?: Params): Promise<Data> {
    
    let result = null
    if(params === {} || params === undefined){
      result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID:id})
    }else{
      let {query} = params
      result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID:id,...query})
    }
    
    return {result};
  }

  async create (data: any, params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let {versionUUID,schemaName,action,fieldName,type} = data
    
    let result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})
    if(result === null)throw new BadRequest("versionUUID not found")
    // if(type === "")throw new BadRequest("versionUUID not found")
    let client:any =  await this.app.get('postgresClient')
    if(action === "create"){
      let fieldDetail = {fieldName,type}
      
      if(result.schema[schemaName] === undefined){
        await client.query('BEGIN')
        await client.query(`CREATE TABLE "${schemaName}_${versionUUID}" (_uuid char(36),${fieldName} ${type})`)
        await client.query(`CREATE TABLE "${schemaName}_${versionUUID}_c" (_id integer NOT NULL DEFAULT nextval('uuid_c_d_id_seq'::regclass),_uuid char(36),_count integer,_approved integer,_user json,_status integer,_action integer,${fieldName} ${type})`)
        let neo = await this.app.get('neo4jDB')
        let version = versionUUID.replace(/-/g,"")
        await neo.run(`CREATE (:_schema:_${version} {Param})`,{Param:{versionUUID,schemaName}})
        //create table
        result.schema[schemaName] = [fieldDetail]
      }else{
        let found = false
        for(let i =0;i<result.schema[schemaName].length;i++){
          if(result.schema[schemaName][i].fieldName === fieldName){
            found =true
            break
          }
        }
        if(found){
          throw new BadRequest("duplicate fieldName")
        }else{
          //alter table
          await client.query('BEGIN')
          await client.query(`
          ALTER TABLE "${schemaName}_${versionUUID}"
          ADD COLUMN ${fieldName} ${type}`)
          await client.query(`
          ALTER TABLE "${schemaName}_${versionUUID}_c"
          ADD COLUMN ${fieldName} ${type}`)
          // await client.query(`ADD COLUMN ${fieldName} ${type}`)
          result.schema[schemaName].push(fieldDetail)
        }
      }
      let newSchema = {$set:{schema:result.schema}}
      await (await this.app.get('mongoClient')).collection("Schema").updateOne({versionUUID},newSchema)
    }else if(action === "delete"){
      if(result.schema[schemaName] === undefined)throw new BadRequest("schemaName not found")
      let found = false
      let i =0
      for(i =0;i<result.schema[schemaName].length;i++){
        if(result.schema[schemaName][i].fieldName === fieldName){
          found =true
          break
        }
      }
      if(!found){
        throw new BadRequest("fieldName not found")
      }else{
        //drop COLUMN
        await client.query('BEGIN')
        await client.query(`
        ALTER TABLE "${schemaName}_${versionUUID}"
        DROP COLUMN ${fieldName}`)
        await client.query(`
        ALTER TABLE "${schemaName}_${versionUUID}_c"
        DROP COLUMN ${fieldName}`)
        result.schema[schemaName].splice(i,1);
        let newSchema = {$set:{schema:result.schema}}
        await (await this.app.get('mongoClient')).collection("Schema").updateOne({versionUUID},newSchema)
      }
    }else if(action === "drop"){
      await client.query('BEGIN')
      await client.query(`
      DROP TABLE  "${schemaName}_${versionUUID}_c";`)
      await client.query(`
      DROP TABLE  "${schemaName}_${versionUUID}";`)
      delete  result.schema[schemaName]
      let newSchema = {$set:{schema:result.schema}}
      let neo = await this.app.get('neo4jDB')
      let version = versionUUID.replace(/-/g,"")
      await neo.run(`MATCH (n:_${version}:_schema{schemaName:"${schemaName}"}) delete n`,{})
      await (await this.app.get('mongoClient')).collection("Schema").updateOne({versionUUID},newSchema)
    }else{
      throw new BadRequest("action not found")
    }
    await client.query('COMMIT')
    
    // console.log(result)
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
