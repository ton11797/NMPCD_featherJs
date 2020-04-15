import assert from 'assert';
import app from '../../../src/app';

describe('\'auto/act\' service', () => {
  it('registered the service', () => {
    const service = app.service('auto/act');

    assert.ok(service, 'Registered the service');
  });
});
