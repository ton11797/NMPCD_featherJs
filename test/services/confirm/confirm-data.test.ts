import assert from 'assert';
import app from '../../../src/app';

describe('\'confirm/confirmData\' service', () => {
  it('registered the service', () => {
    const service = app.service('confirm/confirm-data');

    assert.ok(service, 'Registered the service');
  });
});
