// Initializes the `search/SDRelate` service on path `/search/sd-relate`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { SdRelate } from './sd-relate.class';
import hooks from './sd-relate.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'search/sd-relate': SdRelate & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/search/sd-relate', new SdRelate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('search/sd-relate');

  service.hooks(hooks);
}
