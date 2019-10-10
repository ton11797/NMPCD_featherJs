import assert from 'assert';
import app from '../../../src/app';

describe('\'versionControl/getVersion\' service', () => {
  it('registered the service', () => {
    const service = app.service('versionControl/get-version');

    assert.ok(service, 'Registered the service');
  });
});
