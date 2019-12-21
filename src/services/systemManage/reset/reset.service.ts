// Initializes the `systemManage/reset` service on path `/systemManage/reset`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Reset } from './reset.class';
import hooks from './reset.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'systemManage/reset': Reset & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/systemManage/reset', new Reset(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('systemManage/reset');

  service.hooks(hooks);
}
