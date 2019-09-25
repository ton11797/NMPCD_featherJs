// Initializes the `versionControl/getAll` service on path `/versionControl/get-all`
const { GetAll } = require('./get-all.class');
const hooks = require('./get-all.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versionControl/get-all', new GetAll(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versionControl/get-all');

  service.hooks(hooks);
};
