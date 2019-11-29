import assert from 'assert';
import app from '../../../src/app';

describe('\'data/insertConfirm\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/insert-confirm');

    assert.ok(service, 'Registered the service');
  });
});
