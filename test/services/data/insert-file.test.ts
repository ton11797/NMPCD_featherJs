import assert from 'assert';
import app from '../../../src/app';

describe('\'data/insert-file\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/insert-file');

    assert.ok(service, 'Registered the service');
  });
});
