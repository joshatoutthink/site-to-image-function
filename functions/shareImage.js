const puppeteer = require("puppeteer-core");
const { webScrape } = require("./webscrape.js");

exports.handler = async (event, context) => {
  res = await webScrape({ event, context }, puppeteer, true);
  return res;
};
