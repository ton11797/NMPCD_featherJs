// Initializes the `data/deleteConfirm` service on path `/data/delete-confirm`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { DeleteConfirm } from './delete-confirm.class';
import hooks from './delete-confirm.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/delete-confirm': DeleteConfirm & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/delete-confirm', new DeleteConfirm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/delete-confirm');

  service.hooks(hooks);
}
