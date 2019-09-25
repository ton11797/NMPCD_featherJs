const users = require('./users/users.service.js');
const test = require('./test/test.service.js');
const versionControlGetAll = require('./versionControl/get-all/get-all.service.js');
const versionControlNewVersion = require('./versionControl/new-version/new-version.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(test);
  app.configure(versionControlGetAll);
  app.configure(versionControlNewVersion);
};
