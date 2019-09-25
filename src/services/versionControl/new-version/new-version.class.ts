import { Id, NullableId, Paginated, Params  } from '@feathersjs/feathers';
import { BadRequest } from '@feathersjs/errors';
import { Application } from '../../../declarations';
import common from '../common'
import neo4jDB from '../../../DAL/neo4j'
import uuidv1 from 'uuid/v1'
interface Data {
  versionName:string,
  refVersion?:string
}
interface ServiceMethods<T> {
  [key: string]: any;
  create (data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
}
interface ServiceOptions {}

export class NewVersion extends common implements ServiceMethods<any> {
  app: Application;
  options: ServiceOptions;
  debug:boolean
  constructor (options: ServiceOptions = {}, app: Application) {
    super()
    this.options = options;
    this.app = app;
    this.debug=true
  }
  async create (data: Data, params?: Params): Promise<object> {
    let {versionName,refVersion} = data
        if(this.debug)console.log(versionName);
        if(this.debug)console.log(refVersion);
        let uuid = uuidv1();
        let neo = new neo4jDB()
        if((await this.getUUID(versionName)).records.length !== 0)throw new BadRequest("duplicate versionName")
        await neo.Session_commit(`CREATE (:version {Param})`,{Param:{uuid,versionName,createDate:new Date().toLocaleString(),changeDate:new Date().toLocaleString(),status:"draft"}})
        if(refVersion !== "" && this.notEmply(refVersion)){
            await neo.Session_commit(`MATCH (a:version {uuid:'${uuid}'}),(b:version {uuid:'${refVersion}'}) CREATE (b)-[r:new]->(a)`,{})
        }
    return {uuid}
  }

  async remove (id: NullableId, params?: Params): Promise<any> {
    return { id };
  }
}
