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
  return csv.map(row => 
    row['Country/Region']
    // todayDate: row['4/28/20'],
    // yesterday: row['4/27/20'],
    // weekAgo: row['4/21/20'],
  );
}

const processUrl = async (url) => {
  const csv = await getCsv(url);
  const formatted = formatCsv(csv);
  console.dir(formatted);
}

processUrl(CONFIRMED_GLOBAL_URL);
