import assert from 'assert';
import app from '../../../src/app';

describe('\'data/searchRelate\' service', () => {
  it('registered the service', () => {
    const service = app.service('data/search-relate');

    assert.ok(service, 'Registered the service');
  });
});
