// Initializes the `versionControl/newVersion` service on path `/versionControl/new-version`
const { NewVersion } = require('./new-version.class');
const hooks = require('./new-version.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/versionControl/new-version', new NewVersion(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('versionControl/new-version');

  service.hooks(hooks);
};
