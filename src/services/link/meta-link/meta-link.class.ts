import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import neo4jDB from '../../../DAL/neo4j'
import { BadRequest } from '@feathersjs/errors';
interface Data {}

interface ServiceOptions {}

export class MetaLink implements ServiceMethods<Data> {
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
    let {node1,node2,version} = data
    let versionSelect = version.replace(/-/g,"")

    let neo = new neo4jDB()  
    // await neo.beginTransaction()
    let linked:any = await neo.Session_commit(`
    MATCH (n1:_${versionSelect}:_schema {schemaName:"${node1}"})-[r]-(n2:_${versionSelect}:_schema {schemaName:"${node2}"})
    RETURN type(r)
    `,{})
    if(linked.records.length !==0)throw new BadRequest("already linked")
    await neo.Session_commit(`
    MATCH (n1:_${versionSelect}:_schema {schemaName:"${node1}"}),(n2:_${versionSelect}:_schema {schemaName:"${node2}"})
    CREATE (n1)-[r:RELTYPE]->(n2)
    RETURN n1,n2`,{})
    // await neo.runTransaction(`return rootA`,{})
    // await neo.runTransaction(``,{})
    // await neo.commit()
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
