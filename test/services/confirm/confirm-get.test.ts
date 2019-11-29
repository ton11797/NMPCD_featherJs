import assert from 'assert';
import app from '../../../src/app';

describe('\'confirm/confirmGet\' service', () => {
  it('registered the service', () => {
    const service = app.service('confirm/confirm-get');

    assert.ok(service, 'Registered the service');
  });
});
