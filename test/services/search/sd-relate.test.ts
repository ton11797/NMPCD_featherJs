import assert from 'assert';
import app from '../../../src/app';

describe('\'search/SDRelate\' service', () => {
  it('registered the service', () => {
    const service = app.service('search/sd-relate');

    assert.ok(service, 'Registered the service');
  });
});
