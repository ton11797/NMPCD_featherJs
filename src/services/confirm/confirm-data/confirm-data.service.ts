// Initializes the `confirm/confirmData` service on path `/confirm/confirm-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { ConfirmData } from './confirm-data.class';
import hooks from './confirm-data.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'confirm/confirm-data': ConfirmData & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/confirm/confirm-data', new ConfirmData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('confirm/confirm-data');

  service.hooks(hooks);
}
