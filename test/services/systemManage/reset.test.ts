import assert from 'assert';
import app from '../../../src/app';

describe('\'systemManage/reset\' service', () => {
  it('registered the service', () => {
    const service = app.service('systemManage/reset');

    assert.ok(service, 'Registered the service');
  });
});
