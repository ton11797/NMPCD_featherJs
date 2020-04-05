import assert from 'assert';
import app from '../../../src/app';

describe('\'auto/mapping\' service', () => {
  it('registered the service', () => {
    const service = app.service('auto/mapping');

    assert.ok(service, 'Registered the service');
  });
});
