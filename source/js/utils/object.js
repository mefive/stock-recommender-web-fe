export function restrictDeepMerge(target, source) {
  for (var i in source) {
    if (i in target) {
      target[i] = source[i];
    }
  }
}

export function getKeySortedArray(source = {}, keys = []) {
  const array = [];

  keys.forEach(key => {
    if (key in source) {
      array.push(source[key])
    }
  });

  return array;
}

export function pick(obj, keys = []) {
  const rt = {};

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  Object.keys(obj).forEach(key => {
    if (keys.indexOf(key) !== -1) {
      rt[key] = obj[key];
    }
  });

  return rt
}

export function omit(obj, keys = []) {
  const rt = {};

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  Object.keys(obj).forEach(key => {
    if (keys.indexOf(key) === -1) {
      rt[key] = obj[key];
    }
  });

  return rt
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}