import { Id, NullableId, Paginated, Params } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import common from '../../../common/ndoeNeo4j'
import { BadRequest,Conflict } from '@feathersjs/errors';
import neo4jDB from '../../../DAL/neo4j'
interface Data {}

interface ServiceOptions {}

interface ServiceMethods<T> {
  [key: string]: any;
  create (data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
}
export class ChangeStatus extends common implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    super()
    this.options = options;
    this.app = app;
  }


  async create (data: any, params?: Params): Promise<any> {
    let {versionUUID,status}= data
    let node = (await this.getNode(versionUUID)).records
    if(node.length === 0)throw new BadRequest("versionUUID not found")
    let currentStatus = node[0]._fields[0].properties.status
    // console.log(currentStatus)
    switch(currentStatus) {
      case "draft":
          switch(status) {
            case "draft":
              throw new BadRequest("same status")
            case "final":
              // code block
              break;
            case "remove":
            // code block
            break;
            case "current":
              // code block
              break;
            default:
              throw new BadRequest("unknow status")
          }
        break;
      case "final":
          switch(status) {
            case "draft":
              throw new BadRequest("can't change final top draft")
            case "final":
              throw new BadRequest("same status")
            case "remove":
            // code block
            break;
            case "current":
              // code block
              break;
            default:
              throw new BadRequest("unknow status")
          }
        break;
      case "remove":
        throw new BadRequest("remove can't change status")
      break;
      case "current":
          switch(status) {
            case "draft":
              throw new BadRequest("can't change final top draft")
            case "final":
              // code block
              break;
            case "remove":
              // code block
            break;
            case "current":
              throw new BadRequest("same status")
            default:
              throw new BadRequest("unknow status")
          }
        break;
      default:
        throw new Conflict("neo4j status incorrent")
    }
    let neo = await this.app.get('neo4jDB')
    if(status ==='current'){
      await neo.run(`
      MATCH (n:version { status: 'current' })
      SET n.status = 'final'`,{})
    }
      await neo.run(`
      MATCH (n:version { uuid: '${versionUUID}' })
      SET n.status = '${status}'`,{})
    
    return node;
  }

}
