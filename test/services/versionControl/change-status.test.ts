import assert from 'assert';
import app from '../../../src/app';

describe('\'versionControl/changeStatus\' service', () => {
  it('registered the service', () => {
    const service = app.service('versionControl/change-status');

    assert.ok(service, 'Registered the service');
  });
});
