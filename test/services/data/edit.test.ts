import assert from 'assert';
import app from '../../../src/app';

describe('\'data/edit\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/edit');

    assert.ok(service, 'Registered the service');
  });
});
