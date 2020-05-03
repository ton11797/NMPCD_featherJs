import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import {ObjectId} from 'mongodb'
interface Data {}

interface ServiceOptions {}

export class Act implements ServiceMethods<Data> {
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
    debug.logging(1,"API_call","Auto-act")
    const {action,_id} = data
    let result  = await (await this.app.get('mongoClient')).collection("autoMapping").findOne({_id:new ObjectId(_id)})
    debug.logging(1,"API_call","Auto-act|Action:"+action)
    if(action ===1){
      for(let i =0;i<result.head.length;i++){
        for(let j =0;j<result.relate[i].length;j++){
          try {
            const tmp = {
              node1:result.detail.node1,
              node2:result.detail.node2,
              uuid1:result.head[i],
              uuid2:result.relate[i][j],
              version:result.versionUUID
            }
            const map_service = this.app.service('link/data-link');
            await map_service.create(tmp,{confirm:true})
          } catch (error) {
            console.log(error)
          }
        }
      }
      await (await this.app.get('mongoClient')).collection("autoMapping").deleteOne({_id:new ObjectId(_id)})
      delete result.head
      delete result.relate
      result.detail.status = 1
      await (await this.app.get('mongoClient')).collection("autoMapping").insertOne(result)
    }else if(action ===2){
      for(let i =0;i<result.head.length;i++){
        for(let j =0;j<result.relate[i].length;j++){
          try {
            const tmp = {
              node1:result.detail.node1,
              node2:result.detail.node2,
              uuid1:result.head[i],
              uuid2:result.relate[i][j],
              versionUUID:result.versionUUID,
              action:0
            }
            console.log(tmp)
            const map_service = this.app.service('link/datalink-confirm');
            await map_service.create(tmp)
          } catch (error) {
            
          }
        }
      }
      
      await (await this.app.get('mongoClient')).collection("autoMapping").deleteOne({_id:new ObjectId(_id)})
      delete result.head
      delete result.relate
      result.detail.status = 2
      await (await this.app.get('mongoClient')).collection("autoMapping").insertOne(result)
    }else if(action ===3){
      await (await this.app.get('mongoClient')).collection("autoMapping").deleteOne({_id:new ObjectId(_id)})
    }else{

    }
    return result;
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
