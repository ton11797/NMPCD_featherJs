import assert from 'assert';
import app from '../../../src/app';

describe('\'link/datalink-confirm\' service', () => {
  it('registered the service', () => {
    const service = app.service('link/datalink-confirm');

    assert.ok(service, 'Registered the service');
  });
});
