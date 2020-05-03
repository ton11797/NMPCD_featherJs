import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class Update implements ServiceMethods<Data> {
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
    let {versionUUID} = data
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","Dashboard_update")
    const schema = await (await this.app.get('mongoClient')).collection("Schema").findOne({versionUUID})
    const schemaList = Object.keys(schema.schema)
    const version = versionUUID.replace(/-/g,"")
    const neo = await this.app.get('neo4jDB')
    const client = await this.app.get('postgresClient')
    let query = ''
    let result:any = []
    let totalData = 0
    for(let i=0;i<schemaList.length;i++){
      query = `MATCH (n:_${version}:_${schemaList[i]}) RETURN count(n)`
      debug.logging(99,"Dashboard_update","neo:"+query)
      const dataCount = parseInt((await neo.run(query)).records[0]._fields[0].low)
      query= `SELECT count(*) FROM "${schemaList[i]}_${versionUUID}_c" WHERE _status = 0 `
      debug.logging(99,"Dashboard_update","postgres:"+query)
      const comfirmCount = parseInt((await client.query(query)).rows[0].count)
      query= `SELECT count(*) FROM "mapping_c" WHERE _version = '${versionUUID}' AND ( _node1 = '${schemaList[i]}' OR _node2 = '${schemaList[i]}')`
      debug.logging(99,"Dashboard_update","postgres:"+query)
      const RelateCount = parseInt((await client.query(query)).rows[0].count)
      query= `SELECT count(*) FROM "mapping_c" WHERE _version = '${versionUUID}' AND  ( _node1 = '${schemaList[i]}' OR _node2 = '${schemaList[i]}') AND _status != 0 `
      debug.logging(99,"Dashboard_update","postgres:"+query)
      const RelateCount2 = parseInt((await client.query(query)).rows[0].count)
      totalData = totalData + dataCount
      result.push({
        Schema:schemaList[i],
        dataCount:dataCount,
        WaitCount:{per:dataCount===0||comfirmCount===0?100:100-Math.floor((comfirmCount*100)/(dataCount+comfirmCount)),value:comfirmCount},
        RelateCount:{count:RelateCount,confirm:RelateCount2,per:RelateCount2===0||RelateCount===0?100:100-Math.floor((RelateCount2*100)/(RelateCount+RelateCount2))}
      })
    }
    query = `MATCH (n:version)
    WHERE NOT n.status = 'remove'
    RETURN count(n)`
    debug.logging(99,"Dashboard_update","neo:"+query)
    const versionCount = (await neo.run(query)).records[0]._fields[0].low
    const detail ={
      schemaCount:schemaList.length,
      versionCount:versionCount,
      totalData:totalData,
      schemaDetail:result
    }
    return detail;
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
