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
import linkDataLink from './link/data-link/data-link.service';
import dataSearchData from './data/search-data/search-data.service';
import dataInsertConfirm from './data/insert-confirm/insert-confirm.service';
import confirmConfirmData from './confirm/confirm-data/confirm-data.service';
import confirmConfirmGet from './confirm/confirm-get/confirm-get.service';
import confirmConfirmLink from './confirm/confirm-link/confirm-link.service';
import dataDeleteData from './data/delete-data/delete-data.service';
import dataEditData from './data/edit-data/edit-data.service';
import dataEditConfirm from './data/edit-confirm/edit-confirm.service';
import dataDeleteConfirm from './data/delete-confirm/delete-confirm.service';
import dataSearchRelate from './data/search-relate/search-relate.service';
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
  app.configure(linkDataLink);
  app.configure(dataSearchData);
  app.configure(dataInsertConfirm);
  app.configure(confirmConfirmData);
  app.configure(confirmConfirmGet);
  app.configure(confirmConfirmLink);
  app.configure(dataDeleteData);
  app.configure(dataEditData);
  app.configure(dataEditConfirm);
  app.configure(dataDeleteConfirm);
  app.configure(dataSearchRelate);
}
