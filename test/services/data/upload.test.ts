import assert from 'assert';
import app from '../../../src/app';

describe('\'data/upload\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/upload');

    assert.ok(service, 'Registered the service');
  });
});
