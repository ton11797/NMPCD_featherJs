// Initializes the `link/datalink-confirm` service on path `/link/datalink-confirm`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { DatalinkConfirm } from './datalink-confirm.class';
import hooks from './datalink-confirm.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'link/datalink-confirm': DatalinkConfirm & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/link/datalink-confirm', new DatalinkConfirm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('link/datalink-confirm');

  service.hooks(hooks);
}
