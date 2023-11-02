const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setViewport({width: 1920, height: 1080});

  // Navigate the page to a URL
  await page.goto('https://skinport.com/market?sort=date&order=desc');



  // await browser.close();
})();
