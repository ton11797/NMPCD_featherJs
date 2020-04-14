// Initializes the `dashboard/update` service on path `/dashboard/update`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Update } from './update.class';
import hooks from './update.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'dashboard/update': Update & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/dashboard/update', new Update(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('dashboard/update');

  service.hooks(hooks);
}
