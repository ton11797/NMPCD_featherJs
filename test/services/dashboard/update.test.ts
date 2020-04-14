import assert from 'assert';
import app from '../../../src/app';

describe('\'dashboard/update\' service', () => {
  it('registered the service', () => {
    const service = app.service('dashboard/update');

    assert.ok(service, 'Registered the service');
  });
});
