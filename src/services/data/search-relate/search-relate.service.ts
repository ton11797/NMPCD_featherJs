// Initializes the `data/searchRelate` service on path `/data/search-relate`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { SearchRelate } from './search-relate.class';
import hooks from './search-relate.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/search-relate': SearchRelate & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/search-relate', new SearchRelate(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/search-relate');

  service.hooks(hooks);
}
