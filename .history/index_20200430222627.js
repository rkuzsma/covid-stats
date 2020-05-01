const fetch = require("node-fetch");
const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getCsv = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const csv = Papa.parse(text, { header: true }).data;
  return csv;
};

const formatCsv = csv => {
  const yesterday = getDaysAgo(1);
  const twoDaysAgo = getDaysAgo(2);
  const eightDaysAgo = getDaysAgo(8);
  return csv.map(row => ({
    country: row['Country/Region'],
    [yesterday]: row[yesterday],
    [twoDaysAgo]: row[twoDaysAgo],
    [eightDaysAgo]: row[eightDaysAgo],
  }));
}

const processUrl = async (url) => {
  const csv = await getCsv(url);
  const formatted = formatCsv(csv);
  console.dir(formatted);
}

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

processUrl(CONFIRMED_GLOBAL_URL);
