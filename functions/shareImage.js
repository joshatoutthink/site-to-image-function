const puppeteer = require("puppeteer-core");
const { builder } = require("@netlify/functions");
//  const { webScrape } = require("../src/webscrape.js");
const chromium = require("chrome-aws-lambda");

const handler = async (event, context) => {
  res = await webScrape({ event, context }, puppeteer, true);
  return res;
};

exports.handler = handler;
//exports.handler = async function hey() {
//  return {
//    status: 200,
//   body: "hey",
//  };
//};

async function webScrape({ event }, _, isProd) {
  // BUILDING THE URL OF SITE TO SCREENSHOT
  const [, , ...rest] = event.path.split("/");
  const paths = rest.join("/").split("~/");
  const options = paths.reduce((options, entry, i, all) => {
    if (i % 2 == 0) {
      options.push({ key: entry, value: all[i + 1] });
    }
    return options;
  }, []);
  let url = options.find(findUrlOption) && options.find(findUrlOption).value;
  if (!url) {
    return {
      statusCode: 400,
      body: "no url option was provided",
    };
  }
  url += options
    .filter(filterOutReserved) //removes the url option
    .reduce((url, { key, value }) => `${url}&${key}=${value}`, "?");

  const width = options.find(findWidthOption);
  const height = options.find(findHeightOption);
  // SCREENSHOOTING THE PARSED URL
  var browser;
  try {
    const launchConfig = {
      headless: isProd ? chromium.headless : true,
      args: chromium.args,
    };
    if (isProd) {
      launchConfig.executablePath = await chromium.executablePath;
    }

    browser = await chromium.puppeteer.launch(launchConfig);

    var page = await browser.newPage();
    page.setViewport({
      width: width ? parseInt(width.value) : 1200,
      height: height ? parseInt(height.value) : 800,
      deviceScaleFactor: 2,
    });
    await page.goto(`${url}`);
    // await page.waitForTimeout(isProd ? 100 : 100);
    await page.waitForSelector("body");
    const screenshot = await page.screenshot();

    await browser.close();

    return {
      statusCode: 200,
      body: screenshot.toString("base64"),
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  } catch (err) {
    // Catch and display errors
    console.error(err);
    await browser.close();
    return {
      statusCode: 200,
      body: "noooooooo it didn't work",
    };
  }
}

const findUrlOption = (o) => o.key == "url";
const findWidthOption = (o) => o.key == "width" || o.key == "w";
const findHeightOption = (o) => o.key == "height" || o.key == "h";

// add all callback functions that look for reserved keys
const reservedCb = [findUrlOption, findWidthOption, findHeightOption];
function filterOutReserved(o) {
  for (cb of reservedCb) {
    if (cb(o)) {
      return false;
    }
  }
  return true;
}
