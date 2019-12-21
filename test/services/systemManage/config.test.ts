import assert from 'assert';
import app from '../../../src/app';

describe('\'systemManage/config\' service', () => {
  it('registered the service', () => {
    const service = app.service('systemManage/config');

    assert.ok(service, 'Registered the service');
  });
});
