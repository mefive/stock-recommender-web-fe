export function remove(array = [], predicate = () => null) {
  const rt = [];

  array.forEach((item) => {
    if (!predicate(item)) {
      rt.push(item);
    }
  });

  return rt;
}

export function sortBy(array = [], key = '') {
  const rt = [...array];

  return rt.sort((a, b) => {
    if ((typeof a === 'object' && key in a)
      && (typeof b === 'object' && key in b)
    ) {
      return a[key] - b[key];
    }
    else {
      return 0;
    }
  });
}

export function every(array = [], predicate = () => null) {
  let rt = true;

  array.forEach((item) => {
    if (!predicate(item)) {
      rt = false;
      return false;
    }
  });

  return rt;
}

export function findLastIndex(array = [], predicate = () => null) {
  let index = -1;
  const length = array.length || 0;

  for (let i = length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      index = i;
      break;
    }
  }

  return index;
}
