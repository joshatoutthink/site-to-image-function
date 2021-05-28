const puppeteer = require("puppeteer");
const { webscrape } = require("./webscrape.js");

exports.handler = (event, context) =>
  webscrape({ event, context }, puppeteer, false);
