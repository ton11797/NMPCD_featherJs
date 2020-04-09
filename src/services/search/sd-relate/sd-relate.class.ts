import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';

interface Data {}

interface ServiceOptions {}

export class SdRelate implements ServiceMethods<Data> {
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
    const debug = this.app.get('debug')
    debug.logging(1,"API_call","sd-relate")
    const {schemaName,versionUUID,destination,source}= data
    let versionSelect = schemaName.replace(/-/g,"")
    const neo = await this.app.get('neo4jDB')
    let neoQuery = `MATCH (start:_schema {versionUUID:"${versionUUID}",schemaName:"${schemaName}"}),(end:_schema {versionUUID:"${versionUUID}",schemaName:"${destination}"}), p = shortestPath((start)-[*]-(end))
    RETURN p`
    const relation = await neo.run(neoQuery,{})
    const shortestPath = relation.records[0]._fields[0].segments.map((el:any)=>{
      return el.end.properties.schemaName
    })
    debug.logging(99,"sd-relate","neo "+neoQuery)
    debug.logging(99,"sd-relate","shortestPath "+shortestPath)
    neoQuery =`MATCH p =(n:_data:_${schemaName} {uuid:"${source}"})-[_${versionSelect}*]-(n2:_${destination}) RETURN n,p`
    const relateData = await neo.run(neoQuery,{})
    debug.logging(99,"sd-relate","neo "+neoQuery)
    const resultRelate = relateData.records.map((el:any)=>{
      return el._fields
    }).map((el:any)=>{
      el.shift()
      return el
    }).map((el:any)=>{
      return el[0].segments
    }).filter((el:any)=>{
      return this.checkRelation(el,shortestPath,versionUUID)
    })
    const searchData_service = this.app.service('data/search-data');
    let result = []
    for(let i=0;i<resultRelate.length;i++){
      let temp1:any = []
      for(let j=0;j<resultRelate[i].length;j++){
        try {
          temp1.push((await searchData_service.create(resultRelate[i][j])).rows[0])
        } catch (error) {
          return error;
        }
      }
      result.push(temp1)
    }
    
    return {result,shortestPath}
  }

  checkRelation(path:any,shortestPath:Array<string>,versionUUID:string){
    for(let i=0;i<path.length;i++){
      const temp = path[i].end.labels.find((el:any)=>{
        if(el === `_${shortestPath[i]}`)return true
        return false
      })
      if(temp === undefined)return false
      path[i] = {
        versionUUID,
        schemaName:shortestPath[i],
        condition:{
          _uuid:path[i].end.properties.uuid
        },
      }
    }
    if(path.length !== shortestPath.length) return false
    return true
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
