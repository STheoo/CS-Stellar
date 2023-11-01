const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch(
      {headless: false, defaultViewport: false, userDataDir: './tmp'});

  // Create a new page
  const page = await browser.newPage();

  await page.goto(
      'https://buff.163.com/market/csgo#tab=selling&page_num=1&min_price=10');

  const login = await page.$('#navbar-user-name');
  if (login !== null) {
    console.log('logged in')
  } else {
    console.log('not logged in')

    const pageTarget = page.target();

    await page.click('#j_login_other');

    const newTarget =
        await browser.waitForTarget(target => target.opener() === pageTarget);

    const newPage = await newTarget.page();

    await newPage.click('#imageLogin');
  }


  let isBtnDisabled = false;
  while (!isBtnDisabled) {
    try {
      await page.waitForSelector('.card_csgo > li', {timeout: 5000});
    } catch (error) {
      await page.reload();
      await page.waitForSelector('.card_csgo > li');
    }
    const productsHandles = await page.$$('.card_csgo > li');

    for (const producthandle of productsHandles) {
      let title = 'Null';
      let price = 'Null';


      try {
        title = await page.evaluate(
            (el) => el.querySelector('h3 > a').textContent, producthandle);
      } catch (error) {
      }

      try {
        price = await page.evaluate(
            (el) => el.querySelector('p > strong').textContent, producthandle);
      } catch (error) {
      }

      if (title !== 'Null') {
        fs.appendFile(
            'results.csv', `${title.replace(/,/g, '.')},${price}\n`,
            function(err) {
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

  await browser.close();
})();


