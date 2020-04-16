import assert from 'assert';
import app from '../../../src/app';

describe('\'confirm/confirm-getLink\' service', () => {
  it('registered the service', () => {
    const service = app.service('confirm/confirm-get-link');

    assert.ok(service, 'Registered the service');
  });
});
