import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
const { validate } = require('feathers-hooks-common');
import { BadRequest,MethodNotAllowed } from '@feathersjs/errors';
const { authenticate } = authentication.hooks;
interface Data {
  versionName:string,
  refVersion?:string
}
export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [()=>{return}],
    get: [],
    create: [
      validate((data:Data)=>{
        if(data.versionName === null || data.versionName === undefined)return new BadRequest('versionName field not found')
        if(/[!@#$%^&*(),?":{}|<>]$/.test(data.versionName))return new BadRequest('special characters not allowed')
        if(data.versionName === "" )return new BadRequest('versionName field can\'t empty')
      })
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
