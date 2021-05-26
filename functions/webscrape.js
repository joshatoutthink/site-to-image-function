const puppeteer = process.env.DEV
  ? require("puppeteer-core")
  : require("puppeteer");
const chromium = require("chrome-aws-lambda");

exports.handler = async (event, context) => {
  const url = event.queryStringParameters.url;
  var browser;
  try {
    console.log(url);

    const launchConfig = {
      headless: process.env.PROD ? chromium.headless : true,
    };
    if (process.env.PROD) {
      launchConfig.executablePath = chromium.executablePath;
    }
    browser = await puppeteer.launch(launchConfig);

    var page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector("title");
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
    console.log(err);
    await browser.close();
    return {
      statusCode: 200,
      body: "noooooooo it didn't work",
    };
  }
};
