import { Application } from '../declarations';
import users from './users/users.service';
import versionControlNewVersion from './versionControl/new-version/new-version.service';
import versiobControlChangeState from './versiobControl/change-state/change-state.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(versionControlNewVersion);
  app.configure(versiobControlChangeState);
}
