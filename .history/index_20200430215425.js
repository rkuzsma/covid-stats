const fetch = require("node-fetch");
const url = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const Papa = require('papaparse');

const getData = async url => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const csv = Papa.parse(text);
    console.dir(csv);
  } catch (error) {
    console.log(error);
  }
};

getData(url);
