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
  return csv.map(row => ({
    country: row['Country/Region'],
    [today()]: row['4/28/20'],
    [yesterday()]: row['4/27/20'],
    [weekAgo()]: row['4/21/20'],
  }));
}

const processUrl = async (url) => {
  const csv = await getCsv(url);
  const formatted = formatCsv(csv);
  console.dir(formatted);
}

const today = () => {
  return formatDate(new Date());
}

const yesterday = () => {
  const today = new Date();
  const y = new Date(today);
  y.setDate(y.getDate() - 1)
  return formatDate(y);
}

const weekAgo = () => {
  const today = new Date();
  const w = new Date(today);
  w.setDate(w.getDate() - 1)
  return formatDate(w);
}

const formatDate = date => {
  var d = String(date.getDate());
  var m = String(date.getMonth() + 1); //January is 0!
  var yy = date.getFullYear().toString().substr(-2);
  return d + '/' + m + '/' + yy;
}

processUrl(CONFIRMED_GLOBAL_URL);
