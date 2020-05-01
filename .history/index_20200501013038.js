const fetch = require("node-fetch"); // fetch web content
const Papa = require('papaparse'); // parse CSV files

const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const DEATHS_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
const CONFIRMED_US_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv";
const DEATHS_US_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_US.csv";

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

const YESTERDAY = getDaysAgo(4);
const TWO_DAYS_AGO = getDaysAgo(5);
const EIGHT_DAYS_AGO = getDaysAgo(11);

const formatCsv = csv => {
  return csv.map(row => ({
    Region: row['Country/Region'] || row['Province_State'],
    [YESTERDAY]: String(row[YESTERDAY]),
    [TWO_DAYS_AGO]: String(row[TWO_DAYS_AGO]),
    [EIGHT_DAYS_AGO]: String(row[EIGHT_DAYS_AGO]),
    ['% 24 hr change']: String((((row[YESTERDAY] - row[TWO_DAYS_AGO]) / row[TWO_DAYS_AGO]) * 100).toFixed(1)),
    ['% 1 week change']: String((((row[YESTERDAY] - row[EIGHT_DAYS_AGO]) / row[EIGHT_DAYS_AGO]) * 100).toFixed(1)),
  }));
}

const toRedditMarkdown = (jsonArray) => {
  const result = [];
  const headings = Object.keys(jsonArray[0]);
  
  const cellWidths = {};
  headings.forEach(h => cellWidths[h] = h.length);
  jsonArray.forEach(row => {
    headings.forEach((h) => {
      cellWidths[h] = Math.max(row[h].length, cellWidths[h]);
    });
  });

  const headingsPadded = headings.map(h => h + ' '.repeat(cellWidths[h] - h.length));
  const separators = headings.map(h => '-'.repeat(cellWidths[h]));
  
  const formatRow = (row) => {
    return headings.map(h => {
      return row[h] + ' '.repeat(cellWidths[h] - row[h].length);
    });
  }

  result.push('| ' + headingsPadded.join(' | ') + ' |');
  result.push('|-' + separators.join('-|-') + '-|');
  
  return result.concat(jsonArray.map(row => '| ' + formatRow(row).join(' | ') + ' |')).join("\n");
}

const groupCsvByState = csv => {
  results = {};
  csv.forEach(row => {
    state = row['Province_State'];
    existingRow = results[state] || {};
    results[state] = existingRow;
    Object.keys(row).forEach(key => {
      if (isNaN(row[key])) {
        existingRow[key] = row[key];
      }
      else {
        existingRow[key] = parseInt(row[key]) + (existingRow[key] || 0);
      }
    });
  });
  return Object.values(results);
}

const generateStats = async () => {
  console.log('Confirmed cases globally (cut off 30k)');
  console.log('');
  console.log(toRedditMarkdown(
    formatCsv(await getCsv(CONFIRMED_GLOBAL_URL))
      .filter(row => row[YESTERDAY] > 30000)
      .sort((a, b) => b[YESTERDAY] - a[YESTERDAY])));
  console.log('');

  console.log('Attributable deaths globally (cut off 2k)');
  console.log('');
  console.log(toRedditMarkdown(
    formatCsv(await getCsv(DEATHS_GLOBAL_URL))
      .filter(row => row[YESTERDAY] > 2000)
      .sort((a, b) => b[YESTERDAY] - a[YESTERDAY])));
  console.log('');

  console.log('Confirmed cases US (cut off 10k)');
  console.log('');
  console.log(toRedditMarkdown(
    formatCsv(groupCsvByState(await getCsv(CONFIRMED_US_URL)))
      .filter(row => row[YESTERDAY] > 10000)
      .sort((a, b) => b[YESTERDAY] - a[YESTERDAY])));
  console.log('');

  console.log('Attributable deaths US (cut off 500)');
  console.log('');
  console.log(toRedditMarkdown(
    formatCsv(groupCsvByState(await getCsv(DEATHS_US_URL)))
      .filter(row => row[YESTERDAY] > 500)
      .sort((a, b) => b[YESTERDAY] - a[YESTERDAY])));
  console.log('');
}

generateStats();
