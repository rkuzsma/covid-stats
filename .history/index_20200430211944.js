const fetch = require("node-fetch");
const url = "https://jsonplaceholder.typicode.com/posts/1";

const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log(error);
  }
};

getData(url);
