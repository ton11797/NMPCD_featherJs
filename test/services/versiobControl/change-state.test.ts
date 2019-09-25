import assert from 'assert';
import app from '../../../src/app';

describe('\'versiobControl/changeState\' service', () => {
  it('registered the service', () => {
    const service = app.service('versiobControl/change-state');

    assert.ok(service, 'Registered the service');
  });
});
