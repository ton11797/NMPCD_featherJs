import { Id, NullableId, Paginated, Params  } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Application } from '../../../declarations';
import common from '../../../common/ndoeNeo4j'
import neo4jDB from '../../../DAL/neo4j'
import postgresDB from '../../../DAL/postgres'
import uuidv1 from 'uuid/v1'
import { MongoClient } from 'mongodb';
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
  async connectDB(){
    this.DB = await MongoClient.connect(await this.app.get('mongodb'), { useNewUrlParser: true })
  }
  async closeDB(){
    this.DB.close()
  }
  async create (data: Data, params?: Params): Promise<object> {
    let {versionName,refVersion} = data
        if(this.debug)console.log(versionName);
        if(this.debug)console.log(refVersion);
        let uuid = uuidv1();
        let neo = new neo4jDB()
        if((await this.getUUID(versionName)).records.length !== 0)throw new BadRequest("duplicate versionName")
        await neo.Session_commit(`CREATE (:version {Param})`,{Param:{uuid,versionName,createDate:new Date().toLocaleString(),changeDate:new Date().toLocaleString(),status:"draft"}})
        await this.connectDB()
        
        if(refVersion !== "" && this.notEmply(refVersion)){
          let result = await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").findOne({versionUUID:refVersion})
          result.versionUUID = uuid
          delete result._id
          let db = new postgresDB()
          let client:any = await db.open()
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
            let version = uuid.replace(/-/g,"")
            await neo.Session_commit(`CREATE (:_schema:_${version} {Param})`,{Param:{versionUUID:uuid,schemaName:arraySchema[i]}})
          }
          // await client.query('BEGIN')
          // await client.query(`CREATE TABLE "${schemaName}_${versionUUID}" (_uuid char(36),${fieldName} ${type})`)
          await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").insertOne(result)
          await neo.Session_commit(`MATCH (a:version {uuid:'${uuid}'}),(b:version {uuid:'${refVersion}'}) CREATE (b)-[r:new]->(a)`,{})
          await client.query('COMMIT')
        }else{
          await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").insertOne({versionUUID:uuid,schema:{}})
        }
        await this.closeDB()
    return {uuid}
  }

  async remove (id: NullableId, params?: Params): Promise<any> {
    return { id };
  }
}
