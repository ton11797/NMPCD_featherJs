/* eslint-disable no-unused-vars */
const { validate } = require('feathers-hooks-common');
import common from '../common'
exports.NewVersion = class NewVersion extends common {
  constructor (options) {
    this.options = options || {};
  }


  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    console.log(data)
    return data;
  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
}
