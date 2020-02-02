// Initializes the `data/insert-file` service on path `/data/insert-file`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { InsertFile } from './insert-file.class';
import hooks from './insert-file.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/insert-file': InsertFile & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/insert-file', new InsertFile(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/insert-file');

  service.hooks(hooks);
}
