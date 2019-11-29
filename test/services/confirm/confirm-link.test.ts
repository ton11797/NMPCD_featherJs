import assert from 'assert';
import app from '../../../src/app';

describe('\'confirm/confirmLink\' service', () => {
  it('registered the service', () => {
    const service = app.service('confirm/confirm-link');

    assert.ok(service, 'Registered the service');
  });
});
