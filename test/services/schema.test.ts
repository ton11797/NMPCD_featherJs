import assert from 'assert';
import app from '../../src/app';

describe('\'schema\' service', () => {
  it('registered the service', () => {
    const service = app.service('schema');

    assert.ok(service, 'Registered the service');
  });
});
