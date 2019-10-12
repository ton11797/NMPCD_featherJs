import assert from 'assert';
import app from '../../../src/app';

describe('\'link/metaLink\' service', () => {
  it('registered the service', () => {
    const service = app.service('link/meta-link');

    assert.ok(service, 'Registered the service');
  });
});
