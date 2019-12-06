import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import axios from 'axios';
interface Data {}

interface ServiceOptions {}

export class Test implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | any> {
    let neo = await this.app.get('neo4jDB')
    // console.log(this.app.get('neo4jDB'))
    let st =`MATCH (n) RETURN n`
    let test = await neo.run(st,{})
    console.log(test)
    // try {
    //   neo.run(st,{})
    //   .then( (result:object) =>{
    //     console.log(result)
    // })
    // .catch( (error:string) =>{
    //     console.log(error);
    // });
    // } catch (error) {
    //   console.log(error)
    // }
    let ans =  await (await this.app.get('mongoClient')).collection("Schema").find({}).toArray()
    return ans;
  }

  async get (id: Id, params?: Params): Promise<Data> {
    
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
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
