import assert from 'assert';
import app from '../../../src/app';

describe('\'data/searchData\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/search-data');

    assert.ok(service, 'Registered the service');
  });
});
