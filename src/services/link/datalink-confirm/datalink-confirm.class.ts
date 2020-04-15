import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class DatalinkConfirm implements ServiceMethods<Data> {
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
    const {versionUUID,node1,node2,uuid1,uuid2,action} = data
    const debug = this.app.get('debug')
    debug.logging(1,"API_call","datalink-confirm") 
    const client:any = await this.app.get('postgresClient')
    let query = `INSERT INTO "mapping_c" (_version,_node1,_node2,_uuid1,_uuid2,_count,_user,_status,_action,_approved) VALUES ($1,$2,$3,$4,$5,0,'{}',0,$6,0)`
    debug.logging(99,"sd-relate","postgres "+query)
    await client.query(query,[versionUUID,node1,node2,uuid1,uuid2,action]) 
    return {result:"ok"};
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
