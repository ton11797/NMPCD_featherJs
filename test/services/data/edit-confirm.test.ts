import assert from 'assert';
import app from '../../../src/app';

describe('\'data/editConfirm\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/edit-confirm');

    assert.ok(service, 'Registered the service');
  });
});
