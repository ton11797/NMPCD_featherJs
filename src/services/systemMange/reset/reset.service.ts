// Initializes the `systemMange/reset` service on path `/systemMange/reset`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Reset } from './reset.class';
import hooks from './reset.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'systemMange/reset': Reset & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/systemMange/reset', new Reset(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('systemMange/reset');

  service.hooks(hooks);
}
