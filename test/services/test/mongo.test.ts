import assert from 'assert';
import app from '../../../src/app';

describe('\'test/mongo\' service', () => {
  it('registered the service', () => {
    const service = app.service('test/mongo');

    assert.ok(service, 'Registered the service');
  });
});
