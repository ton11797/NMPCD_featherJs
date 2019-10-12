// Initializes the `link/metaLink` service on path `/link/meta-link`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { MetaLink } from './meta-link.class';
import hooks from './meta-link.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'link/meta-link': MetaLink & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/link/meta-link', new MetaLink(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('link/meta-link');

  service.hooks(hooks);
}
