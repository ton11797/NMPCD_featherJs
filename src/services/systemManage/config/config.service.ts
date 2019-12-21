// Initializes the `systemManage/config` service on path `/systemManage/config`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Config } from './config.class';
import hooks from './config.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'systemManage/config': Config & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/systemManage/config', new Config(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('systemManage/config');

  service.hooks(hooks);
}
