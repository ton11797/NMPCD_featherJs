// Initializes the `data/insertConfirm` service on path `/data/insert-confirm`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { InsertConfirm } from './insert-confirm.class';
import hooks from './insert-confirm.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/insert-confirm': InsertConfirm & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/insert-confirm', new InsertConfirm(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/insert-confirm');

  service.hooks(hooks);
}
