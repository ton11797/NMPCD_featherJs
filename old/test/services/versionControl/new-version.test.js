const assert = require('assert');
const app = require('../../../src/app');

describe('\'versionControl/newVersion\' service', () => {
  it('registered the service', () => {
    const service = app.service('versionControl/new-version');

    assert.ok(service, 'Registered the service');
  });
});
