// Initializes the `test/mongo` service on path `/test/mongo`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Mongo } from './mongo.class';
import hooks from './mongo.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'test/mongo': Mongo & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test/mongo', new Mongo(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test/mongo');

  service.hooks(hooks);
}
