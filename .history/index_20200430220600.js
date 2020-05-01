const fetch = require("node-fetch");
const CONFIRMED_GLOBAL_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getCsv = (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const csv = Papa.parse(text, { header: true }).data;
  return csv;
};

const formatCsv = csv => {
  console.dir(csv);
  return csv.map(row => 
    row['Country/Region']
    // todayDate: row['4/28/20'],
    // yesterday: row['4/27/20'],
    // weekAgo: row['4/21/20'],
  );
}
const csv = await getCsv(CONFIRMED_GLOBAL_URL);
// formatCsv(csv);
console.dir(csv);
