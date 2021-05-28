const puppeteer = require("puppeteer");
const { webScrape } = require("./webscrape.js");

exports.handler = (event, context) =>
  webScrape({ event, context }, puppeteer, false);
