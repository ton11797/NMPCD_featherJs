// Initializes the `data/deleteData` service on path `/data/delete-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { DeleteData } from './delete-data.class';
import hooks from './delete-data.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/delete-data': DeleteData & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/delete-data', new DeleteData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/delete-data');

  service.hooks(hooks);
}
