const assert = require('assert');
const app = require('../../../src/app');

describe('\'versionControl/getAll\' service', () => {
  it('registered the service', () => {
    const service = app.service('versionControl/get-all');

    assert.ok(service, 'Registered the service');
  });
});
