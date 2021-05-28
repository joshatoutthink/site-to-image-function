const puppeteer = require("puppeteer-core");
const { builder } = require("@netlify/functions");
const { webScrape } = require("../src/webscrape.js");
const chromium = require("chrome-aws-lambda");

const handler = async (event, context) => {
  res = await webScrape({ event, context }, chromium, true);
  return res;
};

exports.handler = builder(handler);
