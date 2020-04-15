// Initializes the `confirm/confirm-map` service on path `/confirm/confirm-map`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ConfirmMap } from './confirm-map.class';
import hooks from './confirm-map.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'confirm/confirm-map': ConfirmMap & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/confirm/confirm-map', new ConfirmMap(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('confirm/confirm-map');

  service.hooks(hooks);
}
