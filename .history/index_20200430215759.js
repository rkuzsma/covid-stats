const fetch = require("node-fetch");
const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getCsv = async url => {
  const response = await fetch(url);
  const text = await response.text();
  const csv = Papa.parse(text, { header: true });
  return csv;
};

const formatCsv = csv => {
  csv.forEach((col) => {

  })
}
getCsv(CONFIRMED_GLOBAL_URL);
