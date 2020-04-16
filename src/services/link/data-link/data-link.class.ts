import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import neo4jDB from '../../../DAL/neo4j'
import { BadRequest } from '@feathersjs/errors';
interface Data {}

interface ServiceOptions {}

export class DataLink implements ServiceMethods<Data> {
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
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","data-link")
    const config =  await (await this.app.get('mongoClient')).collection("system").findOne({})
    if(data.action === undefined){
      data.action = 0
    }
    if(data.versionUUID === undefined){
      data.versionUUID = data.version
    }
    if(!config.confirmation.allowMappingWithoutConfirm){
      if(!(params!== undefined && params.confirm!== undefined)){
        const map_service = this.app.service('link/datalink-confirm');
        await map_service.create(data)
        return {
          result:"wait for confirm"
        }
      }
    }
    let {node1,node2,uuid1,uuid2,version} = data
    let versionSelect = version.replace(/-/g,"")

    let neo = await this.app.get('neo4jDB')  
    // await neo.beginTransaction()
    let linkedMeta:any = await neo.run(`
    MATCH (n1:_schema:_${versionSelect} {schemaName:"${node1}"})-[r]-(n2:_schema:_${versionSelect} {schemaName:"${node2}"})
    RETURN type(r)
    `,{})
    debug.logging(99,"data-link","neo "+`
    MATCH (n1:_schema:_${versionSelect} {schemaName:"${node1}"})-[r]-(n2:_schema:_${versionSelect} {schemaName:"${node2}"})
    RETURN type(r)
    `)
    if(linkedMeta.records.length ===0){
      throw new BadRequest("Meta link not found")
    }
    let linked:any = await neo.run(`
    MATCH (n1:_${node1}:_data {uuid:"${uuid1}"})-[r:_${versionSelect}]-(n2:_${node2}:_data {uuid:"${uuid2}"})
    RETURN type(r)
    `,{})
    debug.logging(99,"data-link","neo "+`
    MATCH (n1:_${node1}:_data {uuid:"${uuid1}"})-[r:_${versionSelect}]-(n2:_${node2}:_data {uuid:"${uuid2}"})
    RETURN type(r)
    `)
    if(linked.records.length ===0){
      debug.logging(12,"data-link","no relation")
      await neo.run(`
      MATCH (n1:_${node1}:_data {uuid:"${uuid1}"}),(n2:_${node2}:_data {uuid:"${uuid2}"})
      CREATE (n1)-[:_${versionSelect}]->(n2)
      RETURN n1,n2`,{})
      debug.logging(99,"data-link","neo "+`
      MATCH (n1:_${node1}:_data {uuid:"${uuid1}"}),(n2:_${node2}:_data {uuid:"${uuid2}"})
      CREATE (n1)-[:_${versionSelect}]->(n2)
      RETURN n1,n2`)
    }else{
      return data
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
