const puppeteer = require("puppeteer-core");
const { builder } = require("@netlify/functions");
const { webScrape } = require("../src/webscrape.js");
const handler = async (event, context) => {
  res = await webScrape({ event, context }, puppeteer, true);
  return res;
};

exports.handler = builder(handler);
