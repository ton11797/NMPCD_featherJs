// Initializes the `versionControl/getVersion` service on path `/versionControl/get-version`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { GetVersion } from './get-version.class';
import hooks from './get-version.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'versionControl/get-version': GetVersion & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versionControl/get-version', new GetVersion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versionControl/get-version');

  service.hooks(hooks);
}
