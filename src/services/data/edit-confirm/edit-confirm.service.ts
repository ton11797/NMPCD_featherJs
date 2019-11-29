// Initializes the `data/editConfirm` service on path `/data/edit-confirm`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { EditConfirm } from './edit-confirm.class';
import hooks from './edit-confirm.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/edit-confirm': EditConfirm & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/edit-confirm', new EditConfirm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/edit-confirm');

  service.hooks(hooks);
}
