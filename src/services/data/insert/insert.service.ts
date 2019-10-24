// Initializes the `data/insert` service on path `/data/insert`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Insert } from './insert.class';
import hooks from './insert.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/insert': Insert & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/data/insert', new Insert(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/insert');

  service.hooks(hooks);
}
