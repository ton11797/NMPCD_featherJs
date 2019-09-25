// Initializes the `versiobControl/changeState` service on path `/versiobControl/change-state`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ChangeState } from './change-state.class';
import hooks from './change-state.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'versiobControl/change-state': ChangeState & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versiobControl/change-state', new ChangeState(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versiobControl/change-state');

  service.hooks(hooks);
}
