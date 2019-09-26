import { Application } from '../declarations';
import users from './users/users.service';
import versionControlNewVersion from './versionControl/new-version/new-version.service';
import testMongo from './test/mongo/mongo.service';
import schema from './schema/schema.service';
import testSequelize from './test/sequelize/sequelize.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(versionControlNewVersion);
  app.configure(testMongo);
  app.configure(schema);
  app.configure(testSequelize);
}
