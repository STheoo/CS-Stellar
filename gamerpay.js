const fs = require('fs').promises;
const {Cluster} = require('puppeteer-cluster');

const urls = [
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Bayonet&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Bowie&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Butterfly&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Falchion&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Flip&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Gut&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Huntsman&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Karambit&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.M9+Bayonet&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Navaja&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Shadow+Daggers&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Stiletto&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Talon&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Ursus&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Classic&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Skeleton&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Nomad&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Survival&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Paracord&sortBy=deals&ascending=true&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Bloodhound&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Driver&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Hand+Wraps&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Hydra&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Moto&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Specialist&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=Type_Hands.Sport&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&page=1&subtype=CSGO_Type_Pistol.CZ75-Auto&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.Desert+Eagle&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.Dual+Berettas&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.Five-SeveN&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.Glock-18&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.P2000&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.P250&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.R8+Revolver&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.Tec-9&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Pistol.USP-S&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.MAC-10&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.MP5-SD&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.MP7&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.MP9&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.P90&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.PP-Bizon&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SMG.UMP-45&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Machinegun.M249&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Machinegun.Negev&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.AK-47&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.AUG&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.FAMAS&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.Galil+AR&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.M4A1-S&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.M4A4&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_Rifle.SG+553&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SniperRifle.AWP&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SniperRifle.G3SG1&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SniperRifle.SCAR-20&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&subtype=CSGO_Type_SniperRifle.SSG+08&page=1&priceMin=500',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&priceMin=500&subtype=CSGO_Type_Shotgun.MAG-7&page=1',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&priceMin=500&subtype=CSGO_Type_Shotgun.Nova&page=1',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&priceMin=500&subtype=CSGO_Type_Shotgun.Sawed-Off&page=1',
  'https://gamerpay.gg/?sortBy=deals&ascending=true&priceMin=500&subtype=CSGO_Type_Shotgun.XM1014&page=1'
];

(async () => {
  const data = await fs.readFile('skin_evaluations.csv', 'utf-8');

  const lookup =
      (arr, title) => {
        let twoDimArr = arr.map(el => el.split(','));
        let result = twoDimArr.find(el => el[1] == title);

        return result ? result[2] : null;
      }

  let dataArr = data.split('\n');
  dataArr.shift();

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 1,
    monitor: true,
    puppeteerOptions: {
      headless: false,
      defaultViewport: false,
      userDataDir: './tmp',
    },
  });

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({page, data: url}) => {
    await page.goto(url);

    let k_page = 0;
    let isBtnDisabled = false;
    while (!isBtnDisabled && k_page < 3) {
      try {
        await page.waitForSelector(
            'div.ItemFeed_feed__iS5V4 > div.ItemCardNew_wrapper__phLcV',
            {timeout: 5000});
      } catch (error) {
        await page.reload();
        await page.waitForSelector(
            'div.ItemFeed_feed__iS5V4 > div.ItemCardNew_wrapper__phLcV');
      }
      const productsHandles = await page.$$(
          'div.ItemFeed_feed__iS5V4 > div.ItemCardNew_wrapper__phLcV:not(.ItemCardNew_filler____xIr)');

      for (const producthandle of productsHandles) {
        let title = 'Null'
        let isStatTrack = null;
        let type = 'Null';
        let skin = 'Null';
        let wear = 'Null';
        let price = 'Null';

        const match = url.match(/\.[^.]+\.([^&]+)/);

        if (match) {
          type = match[1]
          type = type.replace(/\+/g, ' ');
        } else {
          console.log('Match not found.')
        }

        try {
          let tag = await page.evaluate(
              (el) => el.querySelector('span.ItemCardNewBody_name__SYDXg')
                          .textContent,
              producthandle);
          isStatTrack = tag.match(/ST/g) !== null;
          if (isStatTrack) {
            skin = tag.slice(0, -4);
            skin = skin.match(/[0-9a-zA-Z\s]+/g);
            skin = skin.join('');
          } else {
            skin = tag.slice(0, -2);
            skin = skin.match(/[0-9a-zA-Z\s]+/g);
            skin = skin.join('');
          }
        } catch (error) {
        }

        try {
          wear = await page.evaluate(
              (el) => el.querySelector('span.ItemCardNewBody_wear__vFzrf')
                          .textContent,
              producthandle);
        } catch (error) {
        }

        try {
          price = await page.evaluate(
              (el) =>
                  el.querySelector('div.ItemCardNewBody_pricePrimary__pqq_k')
                      .textContent,
              producthandle);
          price = price.replace(/\,/g, '');
          price = price.replace(/€|\s/g, '');  // Removes euro sign and space
          price = parseFloat(price);             // Converts to float
        } catch (error) {
        }



        if (isStatTrack) {
          title = 'StatTrak™ ' + type + ' | ' + skin + ' (' + wear + ')';
        } else {
          title = type + ' | ' + skin + ' (' + wear + ')';
        }

        let buffPrice = await lookup(dataArr, title);

        // if (buffPrice !== null) {
        //   console.log(title + ': ' + price + ' Buff Price: ' + buffPrice);
        // } else {
        //   console.log('No matching title found');
        // }

        // if (buffPrice > price) {
        //   console.log(
        //       'Offer spotted for ' + title + ': ' + price +
        //       ' Buff price: ' + buffPrice);
        // }

        if (buffPrice - 5 > price / 0.983) {
          console.log(
              'Offer spotted for ' + title + ': ' + price +
              ' Buff price: ' + buffPrice);
          if (type !== 'Null') {
            fs.appendFile(
                'offers.csv',
                `${title},${price},${buffPrice}\n`,
                function(err) {
                  if (err) throw err;
                });
          }
        }
      }

      await page.waitForSelector('div.Pager_pager__GmYON', {visible: true});

      const is_disabled =
          (await page.$('div.Pager_pager__GmYON > a.Pager_next__HLqQ7')) ==
          null;

      k_page++;
      isBtnDisabled = is_disabled;
      if (!is_disabled) {
        await Promise.all([
          page.click('div.Pager_pager__GmYON > a.Pager_next__HLqQ7'),
          page.waitForNavigation({waitUntil: 'networkidle2'}),
        ]);
      }
    }
  });

  for (const url of urls) {
    await cluster.queue(url);
  }

  // await cluster.queue(
  //     'https://gamerpay.gg/?subtype=CSGO_Type_Knife.Bayonet&sortBy=deals&ascending=true&page=1&priceMin=500');

  await cluster.idle();
  await cluster.close();
})();