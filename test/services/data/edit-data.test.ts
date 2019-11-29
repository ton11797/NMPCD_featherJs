import assert from 'assert';
import app from '../../../src/app';

describe('\'data/editData\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/edit-data');

    assert.ok(service, 'Registered the service');
  });
});
