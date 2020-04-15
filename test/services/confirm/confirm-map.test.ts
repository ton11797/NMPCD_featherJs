import assert from 'assert';
import app from '../../../src/app';

describe('\'confirm/confirm-map\' service', () => {
  it('registered the service', () => {
    const service = app.service('confirm/confirm-map');

    assert.ok(service, 'Registered the service');
  });
});
