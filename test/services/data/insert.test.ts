import assert from 'assert';
import app from '../../../src/app';

describe('\'data/insert\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/insert');

    assert.ok(service, 'Registered the service');
  });
});
