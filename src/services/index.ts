import { Application } from '../declarations';
import users from './users/users.service';
import versionControlNewVersion from './versionControl/new-version/new-version.service';
import testMongo from './test/mongo/mongo.service';
import schema from './schema/schema.service';
import testSequelize from './test/sequelize/sequelize.service';
import dataInsert from './data/insert/insert.service';
import systemMangeReset from './systemMange/reset/reset.service';
import versionControlChangeStatus from './versionControl/change-status/change-status.service';
import versionControlGetVersion from './versionControl/get-version/get-version.service';
import testTest from './test/test/test.service';
import linkMetaLink from './link/meta-link/meta-link.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(versionControlNewVersion);
  app.configure(testMongo);
  app.configure(schema);
  app.configure(testSequelize);
  app.configure(dataInsert);
  app.configure(systemMangeReset);
  app.configure(versionControlChangeStatus);
  app.configure(versionControlGetVersion);
  app.configure(testTest);
  app.configure(linkMetaLink);
}
