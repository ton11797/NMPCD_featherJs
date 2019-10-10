import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import neo4jDB from '../../../DAL/neo4j'
interface Data {}

interface ServiceOptions {}

export class GetVersion {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<any> {
    let neo = new neo4jDB()
    let data:any = await neo.Session_commit(`MATCH (n:version) RETURN n`,{})
    let relation:any = await neo.Session_commit(`MATCH p=()-[r:new]->() RETURN p`,{})
    let result = {
      result:{
        version:data.records.map((el: { _fields: any; })=>{
          return el._fields[0].properties
        }),
        relation:relation.records.map((el: { _fields: any; })=>{
          let ell = {start:"",end:""}
          ell.start =el._fields[0].start.properties.uuid
          ell.end =el._fields[0].end.properties.uuid
          return ell
        })
      }
    }
    return result
  }

  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

}
