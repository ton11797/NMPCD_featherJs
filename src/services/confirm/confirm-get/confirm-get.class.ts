import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import version from '../../../common/version'
interface Data {
  versionUUID:string
  type:number
  filter?:{
    schemaName?:string
    schemaName2?:string
    status?:number
    action?:number
    limit?:number
    offset?:number
  }
}

interface ServiceOptions {}

export class ConfirmGet implements ServiceMethods<Data> {
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
    };
  }

  async create (data: Data, params?: Params): Promise<any> {
    let {versionUUID,type,filter} = data
    let schemaList:string[] = []
    let limit:string|number = "ALL"
    let offset:number = 0
    let searchResult:any[] = []
    if(filter !== undefined){
      if(filter.schemaName !== undefined){
        schemaList=[filter.schemaName]
      }
      if(filter.limit !== undefined){
        limit = filter.limit
      }
      if(filter.offset !== undefined){
        offset = filter.offset
      }
    }
    let client:any = await this.app.get('postgresClient')
    if(schemaList.length ===0)schemaList = Object.keys((await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})).schema)
      
    if(type === 0){
      for(let i =0;i<schemaList.length;i++){
        let result = await client.query(`SELECT * FROM "${schemaList[i]}_${versionUUID}_c" limit ${limit} OFFSET ${offset}`) 
        result.schemaName = schemaList[i]
        result.versionUUID = versionUUID
        delete result.command
        delete result.oid
        delete result._parsers
        delete result._types
        delete result.RowCtor
        delete result.rowAsArray
        searchResult = [result ,...searchResult]
      }
    //get confirm list data
    }else{
    //get confirm list link
    }
    return searchResult;
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
