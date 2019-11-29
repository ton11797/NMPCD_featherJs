// Initializes the `confirm/confirmGet` service on path `/confirm/confirm-get`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ConfirmGet } from './confirm-get.class';
import hooks from './confirm-get.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'confirm/confirm-get': ConfirmGet & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/confirm/confirm-get', new ConfirmGet(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('confirm/confirm-get');

  service.hooks(hooks);
}
