import assert from 'assert';
import app from '../../../src/app';

describe('\'test/sequelize\' service', () => {
  it('registered the service', () => {
    const service = app.service('test/sequelize');

    assert.ok(service, 'Registered the service');
  });
});
