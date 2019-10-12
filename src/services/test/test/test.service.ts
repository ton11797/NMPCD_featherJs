// Initializes the `test/test` service on path `/test/test`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Test } from './test.class';
import hooks from './test.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'test/test': Test & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test/test', new Test(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test/test');

  service.hooks(hooks);
}
