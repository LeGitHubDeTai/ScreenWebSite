const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    if(websiteURL == null){
        websiteURL = 'https://tai-studio.netlify.app/';
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(websiteURL);
    await page.screenshot({ path: 'screen.png' });

    await browser.close();
})();