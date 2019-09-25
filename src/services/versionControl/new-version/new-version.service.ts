// Initializes the `versionControl/newVersion` service on path `/versionControl/new-version`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { NewVersion } from './new-version.class';
import hooks from './new-version.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'versionControl/new-version': NewVersion & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versionControl/new-version', new NewVersion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versionControl/new-version');

  service.hooks(hooks);
}
