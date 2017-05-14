export function formatDate(duration = 0, unit = 'd') {
  return moment().add(duration, unit).format('YYYY-MM-DD');
}

export function getDayDiff(end, start) {
  if (!start || !end) return 0;
  return moment.duration(
    moment(end) - moment(start)
  ).days();
}
