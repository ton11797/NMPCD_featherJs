// Initializes the `data/editData` service on path `/data/edit-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { EditData } from './edit-data.class';
import hooks from './edit-data.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/edit-data': EditData & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/edit-data', new EditData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/edit-data');

  service.hooks(hooks);
}
