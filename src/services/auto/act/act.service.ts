// Initializes the `auto/act` service on path `/auto/act`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Act } from './act.class';
import hooks from './act.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'auto/act': Act & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auto/act', new Act(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auto/act');

  service.hooks(hooks);
}
