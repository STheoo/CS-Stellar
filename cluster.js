const fs = require('fs');
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

    let isBtnDisabled = false;
    while (!isBtnDisabled) {
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
          let title = await page.evaluate(
              (el) => el.querySelector('span.ItemCardNewBody_name__SYDXg')
                          .textContent,
              producthandle);
          isStatTrack = title.match(/ST/g) !== null;
          if (isStatTrack) {
            skin = title.slice(0, -4);
            skin = skin.match(/[0-9a-zA-Z\s]+/g);
            skin = skin.join('');
          } else {
            skin = title.slice(0, -2);
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
        } catch (error) {
        }

        if (type !== 'Null') {
          fs.appendFile(
              'test.csv', `${type},${skin},${wear},${isStatTrack},${price}\n`,
              function(err) {
                if (err) throw err;
              });
        }
        // TODO: Match skin to buff csv and compare price and return snipeable
        // or not.
      }

      await page.waitForSelector('div.Pager_pager__GmYON', {visible: true});

      const is_disabled =
          (await page.$('div.Pager_pager__GmYON > a.Pager_next__HLqQ7')) ==
          null;

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