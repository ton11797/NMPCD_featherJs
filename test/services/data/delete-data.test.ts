import assert from 'assert';
import app from '../../../src/app';

describe('\'data/deleteData\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/delete-data');

    assert.ok(service, 'Registered the service');
  });
});
