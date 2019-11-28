// Initializes the `data/searchData` service on path `/data/search-data`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { SearchData } from './search-data.class';
import hooks from './search-data.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/search-data': SearchData & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/search-data', new SearchData(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/search-data');

  service.hooks(hooks);
}
