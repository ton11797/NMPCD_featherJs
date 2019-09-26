// Initializes the `schema` service on path `/schema`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Schema } from './schema.class';
import hooks from './schema.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'schema': Schema & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/schema', new Schema(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('schema');

  service.hooks(hooks);
}
