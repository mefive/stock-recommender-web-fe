import constants from 'config/constants';
import padStart from 'lodash/padStart';

import service from 'core/service';

export function getCategories(start, end, unit) {
  const categories = [];

  const days = getDurationDays(start, end);
  let day;

  if (unit === constants.UNIT_HOUR) {
    for (day = 0; day < days; day++) {
      const date = moment(start).add(day, 'd');

      for (let hour = 0; hour < 24; hour++) {
        categories.push({
          value: `${date.format('DD日')}${hour}时`,
          title: date.format('YYYY-MM-DD') + ' ' + padStart(hour, 2, '0') + ':00'
        });
      }
    }
  }
  else {
    for (day = 0; day < days; day++) {
      const date = moment(start).add(day, 'd');

      categories.push({
        value: date.format('MM-DD'),
        title: date.format('YYYY-MM-DD')
      });
    }
  }

  return categories;
}

export function convertDateRangeToStartEnd(dateRange) {
  let start, end;

  switch (dateRange) {
    case 'today': {
      start = end = moment().format('YYYY-MM-DD');
      break;
    }

    case '7days': {
      end = moment().format('YYYY-MM-DD');
      start = moment().subtract(6, 'd').format('YYYY-MM-DD');
      break;
    }

    case '30days': {
      end = moment().format('YYYY-MM-DD');
      start = moment().subtract(30, 'd').format('YYYY-MM-DD');
      break;
    }
  }

  return { start, end };
}

export function queryFilterOptions(api, appId) {
  const deferred = $.Deferred();

  service.send(api, { appId }, null)
    .done(({ code, data }) => {
      if (code === 0) {
        const options = data.map(i => ({
          value: i,
          title: i
        }));

        deferred.resolve(options);
      }
    });

  return deferred.promise();
}

export function getTableData(data, categories, tableMarixRowName) {
  let tableData;

  if (Array.isArray(data)) {
    tableData = data.map((item, index) => ({
      time: categories[index].title,
      count: item
    }));
  }
  else if (typeof data === 'object') {
    let tableDataMarix = [];

    for (const i in data) {
      tableDataMarix.push(data[i].map((item, index) => {
        const rt = {
          time: categories[index].title,
          count: item
        };

        rt[tableMarixRowName] = i;

        return rt;
      }));
    }
    tableData
      = tableDataMarix.reduce(
        (result, value, key) => result.concat(value), []
      );
  }

  return tableData;
}

function getDurationDays(start, end) {
  const duration = moment.duration(
    moment(end) - moment(start)
  );

  const weeks = duration.asWeeks();

  let days = (weeks * 7);
  days++;

  return days;
}