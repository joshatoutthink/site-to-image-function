const puppeteer = require("puppeteer");
const { webScrape } = require("./src/webscrape.js");

exports.handler = (event, context) =>
  webScrape({ event, context }, puppeteer, false);
