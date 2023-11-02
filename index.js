const fs = require('fs').promises;
const puppeteer = require('puppeteer');

(async () => {
  const start = performance.now();

  // Create a browser instance
  const browser = await puppeteer.launch(
      {headless: true, defaultViewport: false});

  // Create a new page
  const page = await browser.newPage();

  // Load Cookies
  const cookiesString = await fs.readFile('cookies.json');
  const cookies = JSON.parse(cookiesString);
  await page.setCookie(...cookies);

  await page.goto(
      'https://buff.163.com/market/csgo#tab=selling&page_num=1&min_price=10&sort_by=price.asc');

  const login = await page.$('#navbar-user-name');
  if (login !== null) {
    console.log('Logged in.')
  } else {
    console.log('Not Logged in.')

    const pageTarget = page.target();

    await page.click('#j_login_other');

    const newTarget =
        await browser.waitForTarget(target => target.opener() === pageTarget);

    const newPage = await newTarget.page();

    // await newPage.click('#imageLogin');
    try {
      await newPage.click('#imageLogin');
    } catch (error) {
      await newPage.reload();
      await newPage.click('#imageLogin');
    }

    // Save Cookies
    const cookies = await page.cookies();
    await fs.writeFile(
        'cookies.json', JSON.stringify(cookies, null, 2), (err) => {
          if (err) throw err;
          console.log('Cookies saved to cookies.json');
        });
  }


  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    for (let i = 0; i < 3; i++) {
      try {
        await page.waitForSelector('.card_csgo > li', {timeout: 5000});
      } catch (error) {
        await page.reload();
      }
    }
    const productsHandles = await page.$$('.card_csgo > li');

    for (const producthandle of productsHandles) {
      let id = 'Null';
      let title = 'Null';
      let price = 'Null';

      try {
        const href = await page.evaluate(
            (el) => el.querySelector('h3 > a').getAttribute('href'),
            producthandle);
        const match = href.match(/\d+/);
        id = match[0];
      } catch (error) {
      }



      try {
        title = await page.evaluate(
            (el) => el.querySelector('h3 > a').textContent, producthandle);
        title = title.replace(/(★ )/, '');
        title = title.replace(/( Knife)/i, '');
        title = title.replace(/( Gloves)/i, '');
      } catch (error) {
      }

      try {
        price = await page.evaluate(
            (el) => el.querySelector('p > strong').textContent, producthandle);
        price = price.replace(/€|\s/g, '');  // Removes euro sign and space
        price = parseFloat(price);             // Converts to float
      } catch (error) {
      }

      if (title !== 'Null') {
        fs.appendFile(
            'skin_evaluations.csv',
            `${id},${title.replace(/,/g, '.')},${price}\n`, function(err) {
              if (err) throw err;
            });
      }
    }

    await page.waitForSelector(
        'div.pager.card-pager.light-theme.simple-pagination', {visible: true});

    const is_disabled =
        (await page.$('li.disabled > span.current.next')) !== null;

    isBtnDisabled = is_disabled;
    if (!is_disabled) {
      await Promise.all([
        page.click('a.page-link.next'),
        page.waitForNavigation({waitUntil: 'networkidle2'}),
      ]);
    }
  }

  const end = performance.now();

  const duration = end - start;
  console.log(`Execution time: ${duration} milliseconds`);

  await browser.close();
})();
