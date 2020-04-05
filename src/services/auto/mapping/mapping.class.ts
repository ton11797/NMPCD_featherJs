import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class Mapping implements ServiceMethods<Data> {
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

  async create (data: any, params?: Params): Promise<Data> {
    const debug = this.app.get('debug')
    debug.logging(1,"API_call","Auto-mapping")
    const {versionUUID,node1,node2,fieldMap} = data
    const client:any =  await this.app.get('postgresClient')
    let sql = `SELECT * FROM "${node1}_${versionUUID}"`
    debug.logging(99,"data-link","postgres "+sql)
    // console.log(`SELECT * FROM ${schemaName}_${versionUUID} WHERE ${where}`)
    const node1Data = (await client.query(sql)).rows
    let head = []
    let relate = []
    for(let i =0;i<node1Data.length;i++){
      sql = `SELECT * FROM "${node2}_${versionUUID}" WHERE LOWER("${node2}_${versionUUID}".${fieldMap}) like $1`
      debug.logging(99,"data-link","postgres "+sql)
      const match = (await client.query(sql,[`${node1Data[i][fieldMap.toLowerCase()]}%`])).rows
      if(match.length >0){
        head.push(node1Data[i]._uuid)
        relate.push(match.map((el:any)=>el._uuid))
        // if(match.length>1){
        //   console.log(node1Data[i])
        //   console.log(match)
        //   break;
        // }
      }
    }
    return {head,relate};
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
