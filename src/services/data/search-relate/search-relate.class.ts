import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import neo4jDB from '../../../DAL/neo4j'
interface Data {
  schemaName:String,
  uuid:String
}

interface ServiceOptions {}

export class SearchRelate implements ServiceMethods<Data> {
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
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data: Data, params?: Params): Promise<any> {
    const debug = this.app.get('debug')
    debug.logging(1,"API_call","search-relate")
    const {schemaName,uuid} = data
    const neo = await this.app.get('neo4jDB')
    const relation = await neo.run(`MATCH p =(n:_data:_${schemaName} {uuid:"${uuid}"})-[r]-(n2) RETURN p`,{})
    let respond = []
    for(let i=0;i<relation.records.length;i++){
      respond.push({
        start:relation.records[i]._fields[0].start.properties,
        end:relation.records[i]._fields[0].end.properties,
        startLable:relation.records[i]._fields[0].start.labels,
        endLable:relation.records[i]._fields[0].end.labels
      })
    }
    return respond;
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
