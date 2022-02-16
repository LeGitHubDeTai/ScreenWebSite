const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    if(process.env.websiteURL == null){
        process.env.websiteURL = 'https://tai-studio.netlify.app/';
    }
    if(process.env.width != null){
        process.env.width = 1920;
    }
    if(process.env.height != null){
        process.env.height = 1080;
    }

    const browser = await puppeteer.launch({
        defaultViewport: {
          width:process.env.width,
          height:process.env.height
        }
    });
    const page = await browser.newPage();
    await page.goto(process.env.websiteURL);
    await page.screenshot({ path: 'screen.png' });

    await browser.close();
})();