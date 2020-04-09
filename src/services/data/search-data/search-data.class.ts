import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class SearchData implements ServiceMethods<Data> {
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

  async create (data: any, params?: Params): Promise<any> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","search-data")
    let limit:string|number = "ALL"
    let offset:number = 0
    let {schemaName,versionUUID,condition,like,filter,count} = data
    if(filter !== undefined){
      if(filter.limit !== undefined){
        limit = filter.limit
      }
      if(filter.offset !== undefined){
        offset = filter.offset
      }
    }
    let client:any =  await this.app.get('postgresClient')
    // await client.query('BEGIN')
    let where = ''
    if(condition !== undefined){
      let conditionKey = Object.keys(condition)
      for(let i=0;i<conditionKey.length;i++){
        if(where === ''){
          where = `${where} ${conditionKey[i]} = '${condition[conditionKey[i]]}'`
        }else{
          where = `${where} AND ${conditionKey[i]} = '${condition[conditionKey[i]]}'`
        }
      }
    }
    if(like !== undefined){
      let likeKey = Object.keys(like)
      for(let i=0;i<likeKey.length;i++){
        if(where === ''){
          where = `${where} ${likeKey[i]} LIKE '${like[likeKey[i]]}%'`
        }else{
          where = `${where} AND ${likeKey[i]} LIKE '${like[likeKey[i]]}%'`
        }
      }
    }
    if(where !== '')where = 'WHERE ' +where
    let sql = `SELECT * FROM "${schemaName}_${versionUUID}" ${where} limit ${limit} OFFSET ${offset}`
    debug.logging(99,"data-link","postgres "+sql)
    // console.log(`SELECT * FROM ${schemaName}_${versionUUID} WHERE ${where}`)
    let searchData = await client.query(sql)
    sql = `SELECT COUNT(*) FROM "${schemaName}_${versionUUID}";`
    debug.logging(99,"data-link","postgres "+sql)
    const countRow = await client.query(sql)
    searchData.countRow = countRow.rows[0]
    delete searchData.command
    delete searchData.oid
    delete searchData._parsers
    delete searchData._types
    delete searchData.RowCtor
    delete searchData.rowAsArray
    return searchData;
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
