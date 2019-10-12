import assert from 'assert';
import app from '../../../src/app';

describe('\'test/test\' service', () => {
  it('registered the service', () => {
    const service = app.service('test/test');

    assert.ok(service, 'Registered the service');
  });
});
