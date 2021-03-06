const fetch = require("node-fetch");
const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getCsv = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const csv = Papa.parse(text, { header: true }).data;
  return csv;
};

const getDaysAgo = (daysAgo) => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(result.getDate() - daysAgo)
  return formatDate(result);
}

const formatDate = date => {
  var d = String(date.getDate());
  var m = String(date.getMonth() + 1); //January is 0!
  var yy = date.getFullYear().toString().substr(-2);
  return m + '/' + d + '/' + yy;
}

const YESTERDAY = getDaysAgo(1);
const TWO_DAYS_AGO = getDaysAgo(2);
const EIGHT_DAYS_AGO = getDaysAgo(8);

const formatCsv = csv => {
  return csv.map(row => ({
    Region: row['Country/Region'],
    [YESTERDAY]: row[YESTERDAY],
    [TWO_DAYS_AGO]: row[TWO_DAYS_AGO],
    [EIGHT_DAYS_AGO]: row[EIGHT_DAYS_AGO],
    ['% 24 hr change']: (((row[YESTERDAY] - row[TWO_DAYS_AGO]) / row[TWO_DAYS_AGO]) * 100).toFixed(1),
    ['% 1 week change']: (((row[YESTERDAY] - row[EIGHT_DAYS_AGO]) / row[EIGHT_DAYS_AGO]) * 100).toFixed(1),
  }));
}

const toRedditMarkdown = (jsonArray) => {
  const result = [];
  const headings = Object.keys(jsonArray[0]);
  
  const cellWidths = new Array(headings.length).fill(0);
  jsonArray.forEach(row => {
    headings.forEach((h,i) => {
      cellWidths[i] = Math.max(row[h], cellWidths[i]);
    });
  });

  const separators = cellWidths.map(width => '-'.repeat(width));

  result.push('| ' + headings.join(' | ') + ' |');
  result.push('|-' + separators.join('-|-') + '-|');
  console.dir(result);
  return 'x';
  const formatRow = (row) => {
    return headings.map((h,i) => {
      return row[h] + ' '.repeat(cellWidths[i] - row[h].length);
    });
  }
  result.concat(jsonArray.map(row => '| ' + formatRow(row).join(' | ') + ' |'));
  return result;
}

const generateStats = async () => {
  const globalCases = formatCsv(await getCsv(CONFIRMED_GLOBAL_URL))
    .filter(row => row[YESTERDAY] > 30000)
    .sort((a,b) => a[YESTERDAY]-b[YESTERDAY]);
  console.dir(toRedditMarkdown(globalCases));
}

generateStats();
