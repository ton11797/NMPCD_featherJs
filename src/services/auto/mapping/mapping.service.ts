// Initializes the `auto/mapping` service on path `/auto/mapping`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Mapping } from './mapping.class';
import hooks from './mapping.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'auto/mapping': Mapping & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/auto/mapping', new Mapping(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('auto/mapping');

  service.hooks(hooks);
}
