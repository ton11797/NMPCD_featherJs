import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import XLSX from 'xlsx'
import fs from 'fs'
interface Data {
  fileName:string,
  importTo:string,
  versionUUID:string
}

interface ServiceOptions {}

export class InsertFile implements ServiceMethods<Data> {
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
    return {};
  }

  async create (data: Data, params?: Params): Promise<any> {
    let debug = this.app.get('debug')
    debug.logging(1,"API_call","insert-file")
    const {fileName,importTo,versionUUID}=data
    const path = `./${this.app.get('fileUploadPath')}/${fileName}`
    const buf = fs.readFileSync(path);
    const workbook = XLSX.read(buf, {type:'buffer'});
    const Insert_data = XLSX.utils.sheet_to_json(workbook.Sheets[importTo]).map(el=>{
      return {
        versionUUID:versionUUID,
        schemaName:importTo,
        value:el
      }
    })
    const Insert_service = this.app.service('data/insert');
    try {
      await Insert_service.create(Insert_data)
    } catch (error) {
      return error;
    }
    debug.logging(1,"API_call","insert-file done")
    return 'ok';
  }

  async update (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch (id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove (id: NullableId, params?: Params): Promise<any> {
    return {  };
  }
}
