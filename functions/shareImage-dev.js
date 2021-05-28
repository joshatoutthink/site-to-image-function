const puppeteer = require("puppeteer");
const { webScrape } = require("../src/webscrape.js");
const chromium = require("chrome-aws-lambda");

exports.handler = (event, context) =>
  webScrape({ event, context }, chromium, false);
