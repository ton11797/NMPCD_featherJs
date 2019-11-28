// Initializes the `link/dataLink` service on path `/link/data-link`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { DataLink } from './data-link.class';
import hooks from './data-link.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'link/data-link': DataLink & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/link/data-link', new DataLink(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('link/data-link');

  service.hooks(hooks);
}
