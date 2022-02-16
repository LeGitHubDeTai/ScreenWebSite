const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    if(process.env.websiteURL == null){
        process.env.websiteURL = 'https://tai-studio.netlify.app/';
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(process.env.websiteURL);
    await page.screenshot({ path: 'screen.png' });

    await browser.close();
})();