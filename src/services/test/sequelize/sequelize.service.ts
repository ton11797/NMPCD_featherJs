// Initializes the `test/sequelize` service on path `/test/sequelize`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../../declarations';
import { Sequelize } from './sequelize.class';
import createModel from '../../../models/sequelize.model';
import hooks from './sequelize.hooks';

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    'test/sequelize': Sequelize & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/test/sequelize', new Sequelize(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test/sequelize');

  service.hooks(hooks);
}
