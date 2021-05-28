const chromium = require("chrome-aws-lambda");

async function webScrape({ event }, puppeteer, isProd) {
  const { url, title, image, text } = event.queryStringParameters;
  console.log(url);
  var browser;
  try {
    // console.log(`${url}&title=${title}&text=${text}&image=${image}`);

    const launchConfig = {
      headless: isProd ? chromium.headless : true,
    };
    if (isProd) {
      launchConfig.executablePath = await chromium.executablePath;
    }

    browser = await puppeteer.launch(launchConfig);

    var page = await browser.newPage();
    await page.goto(`${url}?title=${title}&image=${image}`);
    await page.waitForTimeout(500);
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
}

module.exports = { webScrape };
