import assert from 'assert';
import app from '../../../src/app';

describe('\'versionControl/newVersion\' service', () => {
  it('registered the service', () => {
    const service = app.service('versionControl/new-version');

    assert.ok(service, 'Registered the service');
  });
});
