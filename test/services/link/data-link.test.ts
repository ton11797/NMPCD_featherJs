import assert from 'assert';
import app from '../../../src/app';

describe('\'link/dataLink\' service', () => {
  it('registered the service', () => {
    const service = app.service('link/data-link');

    assert.ok(service, 'Registered the service');
  });
});
