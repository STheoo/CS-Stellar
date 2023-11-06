const fs = require('fs').promises;
const {Cluster} = require('puppeteer-cluster');
const moment = require('moment');
const {time} = require('console');
const util = require('./util.js')

const urls = [];


(async () => {

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 1,
    monitor: true,
    puppeteerOptions: {
      headless: true,
      defaultViewport: false,
      userDataDir: './tmp',
    },
  });

  cluster.on('taskerror', (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({page, data: url}) => {
    await page.goto(url);
  });

  for (const url of urls) {
    await cluster.queue(url);
  }

  await cluster.idle();
  await cluster.close();

})();
