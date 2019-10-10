// Initializes the `versionControl/changeStatus` service on path `/versionControl/change-status`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ChangeStatus } from './change-status.class';
import hooks from './change-status.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'versionControl/change-status': ChangeStatus & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versionControl/change-status', new ChangeStatus(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versionControl/change-status');

  service.hooks(hooks);
}
