const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const moment = require('moment');
const util = require('./util.js')

puppeteer.use(StealthPlugin());

(async () => {
  const skin_values =
      util.convertTo2DArr(await fs.readFile('skin_evaluations.csv', 'utf-8'));
  let skin_offers =
      util.convertTo2DArr(await fs.readFile('offers.csv', 'utf-8'));

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();

  await page.setViewport({width: 1920, height: 1080});

  // Navigate the page to a URL
  await page.goto('https://skinport.com/market?sort=date&order=desc');

  let liveButton = await page.waitForSelector('button.LiveBtn');
  await liveButton.click();

  await page.waitForSelector('div.CatalogPage-items.CatalogPage-items--grid');
  let skin_listings =
      await page.$$('div.CatalogPage-item.CatalogPage-item--grid');
  let listings_taken = 0;
  let listings_pushed = 0;

  while (listings_pushed < 10) {
    for (let i = 0; i < (skin_listings.length - listings_taken); i++) {
      let title = 'Null'
      let type = 'Null';
      let skin = 'Null';
      let wear = 'Null';
      let price = 'Null';
      let timestamp = 'Null';

      // Skin Type
      try {
        type = await skin_listings[i].evaluate(
            node =>
                node.querySelector('div.ItemPreview-itemTitle').textContent);
        type = type.replace(/(★ )|( Knife)|( Gloves)/, '');
      } catch (err) {
        console.log(err)
      }

      // Skin Name
      try {
        skin = await skin_listings[i].evaluate(
            node => node.querySelector('div.ItemPreview-itemName').textContent);
      } catch (err) {
        console.log(err)
      }

      // Condition
      try {
        wear = await skin_listings[i].evaluate(
            node => node.querySelector('div.ItemPreview-itemText').textContent);

        const match = wear.match(
            /Battle-Scarred|Well-Worn|Field-Tested|Minimal Wear|Factory New/);
        wear = match !== null ? match[0] : 'Null';
      } catch (err) {
        console.log(err)
      }

      // Price
      try {
        price = await skin_listings[i].evaluate(
            node => node.querySelector(
                            'div.ItemPreview-priceValue > div.Tooltip-link')
                        .textContent);
        price = price.replace(/\,/g, '');
        price = price.replace(/€|\s/g, '');  // Removes euro sign and space
        price = parseFloat(price);             // Converts to float
      } catch (err) {
        console.log(err);
      }

      // Timestamp
      const now = new Date();
      timestamp = moment(now).format('MM-DD-YYYY[T]HH:mm:ss');

      // Final Title
      title = type + ' | ' + skin + ' (' + wear + ')';

      let buffPrice = await util.lookup(skin_values, title);

      if (buffPrice - 5 > price) {
        console.log(
            'Offer spotted for ' + title + ': ' + price +
            ' Buff price: ' + buffPrice);
        if (!util.offerExists(skin_offers, title, price)) {
          const newOffer = ['SkinPort', title, price, buffPrice, timestamp];
          skin_offers.push(newOffer);
          ++listings_pushed;
          console.log('Pushed offer #' + listings_pushed);
        }
      } else {
        console.log('poop' + title);
      }

      console.log(++listings_taken);
    }

    skin_listings =
        await page.$$('div.CatalogPage-item.CatalogPage-item--grid');

    if (skin_listings.length > 200) {
      await page.reload();
      liveButton = await page.waitForSelector('button.LiveBtn');
      await liveButton.click();

      await page.waitForSelector(
          'div.CatalogPage-items.CatalogPage-items--grid');
      skin_listings =
          await page.$$('div.CatalogPage-item.CatalogPage-item--grid');
      listings_taken = 0;
    }
  }
  // console.log(skin_listings.length);

  const sorted_skin_offers = skin_offers.sort(function(a, b) {
    return util.parseCustomDate(b[4]) - util.parseCustomDate(a[4])
  });

  console.log(sorted_skin_offers);

  fs.writeFile(
      'offers.csv', 'market,title,price,buffprice,timestamp\n', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
      });

  await fs.appendFile(
      'offers.csv', util.convertToCSV(sorted_skin_offers), function(err) {
        if (err) throw err;
      });

  await browser.close();
})();
