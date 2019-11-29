// Initializes the `confirm/confirmLink` service on path `/confirm/confirm-link`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ConfirmLink } from './confirm-link.class';
import hooks from './confirm-link.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'confirm/confirm-link': ConfirmLink & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/confirm/confirm-link', new ConfirmLink(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('confirm/confirm-link');

  service.hooks(hooks);
}
