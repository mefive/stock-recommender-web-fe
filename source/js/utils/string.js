export function padStart(str = '', length = 0, char = '') {
  if (typeof str !== 'string' || typeof char !== 'string') {
    return str;
  }

  const padLength = length - str.length;

  if (padLength <= 0) {
    return str;
  }

  let rt = str;

  for (let i = 0; i < padLength; i++) {
    rt = `${char}${rt}`;
  }

  return rt;
}