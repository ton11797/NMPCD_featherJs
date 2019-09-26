import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { MongoClient } from 'mongodb';
import { BadRequest } from '@feathersjs/errors';
import postgresDB from '../../DAL/postgres'
interface Data {

}
interface ServiceOptions {}
export class Schema implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;
  DB!: MongoClient;
  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }
  async connectDB(){
    this.DB = await MongoClient.connect(await this.app.get('mongodb'), { useNewUrlParser: true })
  }
  async closeDB(){
    this.DB.close()
  }
  async find (params?: Params): Promise<any> {
    await this.connectDB()
    let result = await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").find({}).toArray()
    await this.closeDB()
    console.log(result)
    return {result};
  }

  async get (id: Id, params?: Params): Promise<Data> {
    await this.connectDB()
    let result = null
    if(params === {} || params === undefined){
      result = await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").findOne({versionUUID:id})
    }else{
      let {query} = params
      result = await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").findOne({versionUUID:id,...query})
    }
    await this.closeDB()
    return {result};
  }

  async create (data: any, params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let {versionUUID,schemaName,action,fieldName,type} = data
    await this.connectDB()
    let result = await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").findOne({versionUUID})
    if(result === null)throw new BadRequest("versionUUID not found")
    // if(type === "")throw new BadRequest("versionUUID not found")
    let db = new postgresDB()
    let client:any = await db.open()
    if(action === "create"){
      let fieldDetail = {fieldName,type}
      
      if(result.schema[schemaName] === undefined){
        await client.query('BEGIN')
        await client.query(`CREATE TABLE ${schemaName}_${versionUUID} (uuid char(36),${fieldName} ${type})`)
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
          ALTER TABLE ${schemaName}_${versionUUID}
          ADD COLUMN ${fieldName} ${type}`)
          // await client.query(`ADD COLUMN ${fieldName} ${type}`)
          result.schema[schemaName].push(fieldDetail)
        }
      }
      let newSchema = {$set:{schema:result.schema}}
      await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").updateOne({versionUUID},newSchema)
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
        ALTER TABLE ${schemaName}_${versionUUID}
        DROP COLUMN ${fieldName}`)
        result.schema[schemaName].splice(i,1);
        let newSchema = {$set:{schema:result.schema}}
        await this.DB.db(this.app.get("mongodbDatabase")).collection("Schema").updateOne({versionUUID},newSchema)
      }
    }else{
      throw new BadRequest("action not found")
    }
    await client.query('COMMIT')
    await this.closeDB()
    console.log(result)
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
