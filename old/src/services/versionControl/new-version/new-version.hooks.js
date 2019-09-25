const { authenticate } = require('@feathersjs/authentication').hooks;
const { validate } = require('feathers-hooks-common');
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      validate((data)=>{
        if(data.versionName === null || data.versionName === undefined)return {versionName :'versionName field not found'}
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