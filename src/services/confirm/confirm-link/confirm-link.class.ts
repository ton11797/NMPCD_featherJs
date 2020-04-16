import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { BadRequest } from '@feathersjs/errors';
interface Data {}

interface ServiceOptions {}

export class ConfirmLink implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor (options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find (params?: Params): Promise<Data[] | Paginated<Data>> {
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","confirm-link(GET)")
    let client:any = await this.app.get('postgresClient')
    let queryParams:any = null
    let condition = ""
    if(params !== undefined ){
      queryParams = params.query
      if(queryParams._node1 !== undefined){
        condition = condition + ` _node1 = '${queryParams._node1}' AND`
      }
      if(queryParams._node2 !== undefined){
        condition = condition + ` _node2 = '${queryParams._node2}' AND`
      }
      if(queryParams._status !== undefined){
        condition = condition + ` _status = '${queryParams._status}' AND`
      }
      if(queryParams._action !== undefined){
        condition = condition + ` _action = '${queryParams._action}' AND`
      }
      if(queryParams._version !== undefined){
        condition = condition + ` _version = '${queryParams._version}' AND`
      }
      condition = condition.substring(1, condition.length-3)
    }
    let query = `SELECT * FROM "mapping_c"`
    if(condition !== ""){
      query = `SELECT * FROM "mapping_c" WHERE `+ condition
    }
    debug.logging(99,"confirm-data","postgress "+query)
    let resultQ = (await client.query(query)).rows
    return resultQ;
  }

  async get (id: Id, params?: Params): Promise<Data> {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data: any, params: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","confirm-dataLink") 
    let {confirmId,action} = data
    let {user} = params
    //0 approved 1 reject 2 delete
    if (action === 0 || action === 1 || action === 2){
    }else{
      throw new BadRequest("Bad action")
    }
    let query = `SELECT * FROM "mapping_c" WHERE _id = ${confirmId} `
    debug.logging(99,"confirm-data","postgress "+query)
    let client:any = await this.app.get('postgresClient')
    let resultQ = (await client.query(query)).rows[0]
    let update = ``
    if(action === 2 ){
      update = `DELTE FROM "mapping_c" WHERE _id = ${confirmId}`
    }else{
      if(resultQ._user[user.id] === undefined){
        resultQ._user[user.id] = {
          action,
          email:user.email
        }
        if(action === 0){
          update = `UPDATE "mapping_c"
          SET
          _count = ${resultQ._count+1},
          _approved = ${resultQ._approved+1},
          _user = '${JSON.stringify(resultQ._user)}'
          WHERE _id = ${confirmId}
          `
        }else{
          update = `UPDATE "mapping_c"
          SET
          _count = ${resultQ._count+1},
          _user = '${JSON.stringify(resultQ._user)}'
          WHERE _id = ${confirmId}
          `
        }
      }else{
        if(resultQ._user[user.id].action === action){
          throw new BadRequest("Ready confirm")
        }else{
          if(action ===0){
            resultQ._user[user.id] = {
              action,
              email:user.email
            }
            update = `UPDATE "mapping_c"
            SET
            _approved = ${resultQ._approved+1},
            _user = '${JSON.stringify(resultQ._user)}'
            WHERE _id = ${confirmId}
            `
          }else{
            resultQ._user[user.id] = {
              action,
              email:user.email
            }
            update = `UPDATE "mapping_c"
            SET
            _approved = ${resultQ._approved-1},
            _user = '${JSON.stringify(resultQ._user)}'
            WHERE _id = ${confirmId}
            `
          }
        }
      }
      debug.logging(99,"confirm-data","postgress "+update)
      let result = await client.query(update) 
      const config =  await (await this.app.get('mongoClient')).collection("system").findOne({})
      query = `SELECT * FROM "mapping_c" WHERE _id = ${confirmId} `
      debug.logging(99,"confirm-data","postgress "+query)
      resultQ = (await client.query(query)).rows[0]
      if (resultQ._approved >= config.confirmation.confirmationRequire) {
        if (resultQ._action === 0) {
          try {
            let tmpField = resultQ
            delete tmpField._id
            delete tmpField._uuid
            delete tmpField._count
            delete tmpField._approved
            delete tmpField._user
            delete tmpField._status
            delete tmpField._action
            const request = {
              node1:resultQ._node1,
              node2:resultQ._node2,
              uuid1:resultQ._uuid1,
              uuid2:resultQ._uuid2,
              version:resultQ._version
            }
            console.log(request)
            const insert_service = this.app.service('link/data-link');
            await insert_service.create(request, { confirm: true })
          } catch (error) {

          }
          update = `UPDATE "mapping_c"
            SET
            _status= 1
            WHERE _id = ${confirmId}
            `
          debug.logging(99, "confirm-data", "postgress " + update)
          await client.query(update)
        } else if (resultQ._action === 1) {

        } else if (resultQ._action === 2) {

        } else {

        }
        console.log(resultQ)
      } else if ((resultQ._count - resultQ._approved) >= config.confirmation.rejectThreshold) {
        console.log("rejected")
        update = `UPDATE "mapping_c"
            SET
            _status= 2
            WHERE _id = ${confirmId}
            `
        debug.logging(99, "confirm-data", "postgress " + update)
        await client.query(update)
      }
      delete result.command
      delete result.oid
      delete result._parsers
      delete result._types
      delete result.RowCtor
      delete result.rowAsArray
      return {data,user,resultQ,update,result};
    }
     return {reuslt:"ok"}
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
