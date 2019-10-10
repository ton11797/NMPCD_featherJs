import assert from 'assert';
import app from '../../src/app';

describe('\'versionControl\' service', () => {
  it('registered the service', () => {
    const service = app.service('version-control');

    assert.ok(service, 'Registered the service');
  });
});
