import { Id, NullableId, Paginated, Params  } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Application } from '../../../declarations';
import common from '../../../common/ndoeNeo4j'
import neo4jDB from '../../../DAL/neo4j'
import postgresDB from '../../../DAL/postgres'
import uuidv1 from 'uuid/v1'
import { MongoClient } from 'mongodb';
import logger from '../../../logger';
interface Data {
  versionName:string,
  refVersion?:string
}
interface ServiceMethods<T> {
  [key: string]: any;
  create (data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
}
interface ServiceOptions {}

export class NewVersion extends common implements ServiceMethods<any> {
  app: Application;
  options: ServiceOptions;
  debug:boolean
  DB!: MongoClient;
  constructor (options: ServiceOptions = {}, app: Application) {
    super()
    this.options = options;
    this.app = app;
    this.debug=true
  }
  async create (data: Data, params?: Params): Promise<object> {
    let {versionName,refVersion} = data
        if(this.debug)console.log(versionName);
        if(this.debug)console.log(refVersion);
        let uuid = uuidv1();
        let neo = new neo4jDB()
        if((await this.getUUID(versionName)).records.length !== 0)throw new BadRequest("duplicate versionName")
        await neo.Session_commit(`CREATE (:version {Param})`,{Param:{uuid,versionName,createDate:new Date().toLocaleString(),changeDate:new Date().toLocaleString(),status:"draft"}})
        if(refVersion !== "" && this.notEmply(refVersion) && refVersion !== undefined){
          let result = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID:refVersion})
          result.versionUUID = uuid
          let version = uuid.replace(/-/g,"")
          let versionref = refVersion.replace(/-/g,"")
          delete result._id
          let db = new postgresDB()
          let client:any = await this.app.get('postgresClient')
          let arraySchema =Object.keys(result.schema)
          await client.query('BEGIN')
          for(let i=0;i<arraySchema.length;i++){
            console.log(arraySchema[i])
            //copy confirm schema without data
            await client.query(`
            CREATE TABLE "${arraySchema[i]}_${uuid}_c" AS 
            TABLE "${arraySchema[i]}_${refVersion}_c" 
            WITH NO DATA;`)
            //copy data table
            await client.query(`
            CREATE TABLE "${arraySchema[i]}_${uuid}" AS 
            TABLE "${arraySchema[i]}_${refVersion}";`)
          }
          // await client.query('BEGIN')
          // await client.query(`CREATE TABLE "${schemaName}_${versionUUID}" (_uuid char(36),${fieldName} ${type})`)
          await (await this.app.get('mongoClient')).collection("Schema").insertOne(result)
          await neo.Session_commit(`MATCH (a:version {uuid:'${uuid}'}),(b:version {uuid:'${refVersion}'}) CREATE (b)-[r:new]->(a)`,{})
          // await neo.beginTransaction()
          await neo.Session_commit(`
          MATCH(n:_${versionref}:_schema)
          CALL apoc.refactor.cloneNodesWithRelationships([n]) yield input, output
          SET n.versionUUID = '${uuid}'
          REMOVE n:_${versionref}
          SET n:_${version}
          RETURN n
          `,{})
          // await neo.runTransaction(`return rootA`,{})
          // await neo.runTransaction(``,{})
          // await neo.commit()
          console.log("neo")
          await client.query('COMMIT')
        }else{
          await (await this.app.get('mongoClient')).collection("Schema").insertOne({versionUUID:uuid,schema:{}})
        }
    return {uuid}
  }

  async remove (id: NullableId, params?: Params): Promise<any> {
    return { id };
  }
}
