import assert from 'assert';
import app from '../../../src/app';

describe('\'schema/create\' service', () => {
  it('registered the service', () => {
    const service = app.service('schema/create');

    assert.ok(service, 'Registered the service');
  });
});
