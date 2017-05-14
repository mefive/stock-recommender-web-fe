import constants from 'config/constants';
import every from 'lodash/every';

export function hasAuth({
  appId = 0, perm = 0, permsMap = {}, authList = [] }
) {
  const hasSuperPerm = perm === 10;
  let hasPerm = false;

  const perms = permsMap[appId];

  if (!perms || perms.length === 0) {
    return hasSuperPerm;
  }

  if (perms[0] < constants.USER_PERM_READ_ONLY
    || every(authList, i => perms.indexOf(i) !== -1)
  ) {
    hasPerm = true;
  }

  return hasSuperPerm || hasPerm;
}