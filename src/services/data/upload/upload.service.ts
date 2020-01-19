// Initializes the `data/upload` service on path `/data/upload`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Upload } from './upload.class';
import hooks from './upload.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'data/upload': Upload & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/data/upload', new Upload(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('data/upload');

  service.hooks(hooks);
}
