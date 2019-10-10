import assert from 'assert';
import app from '../../../src/app';

describe('\'systemMange/reset\' service', () => {
  it('registered the service', () => {
    const service = app.service('systemMange/reset');

    assert.ok(service, 'Registered the service');
  });
});
