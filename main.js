/*-----------------------------------------------------------------------------------------\
|  _______                 _____  .               _                ___    ___/  ___    __  |
| '   /      ___  `       (      _/_   ,   .   ___/ `   __.       /   \ .'  /\ /   \ .'    |
|     |     /   ` |        `--.   |    |   |  /   | | .'   \        _-' |  / |   _-' |---. |
|     |    |    | |           |   |    |   | ,'   | | |    |       /    |,'  |  /    |   | |
|     /    `.__/| /      \___.'   \__/ `._/| `___,' /  `._.'      /___, /`---' /___, `._.' |
|                                                 `                                        |                                                                                                                                                                                                                                                 
\-----------------------------------------------------------------------------------------*/
const puppeteer = require('puppeteer');
require('dotenv').config();

(async () => {
    if(process.env.WORKFLOW_INPUT != null){
        var tmp = JSON.parse(process.env.WORKFLOW_INPUT);
        process.env.websiteURL = tmp.websiteURL;
        process.env.width = tmp.width;
        process.env.height = tmp.height;

        console.log('Run With Github Action !');
    }

    if(process.env.websiteURL == null){
        process.env.websiteURL = 'https://tai-studio.netlify.app/';
    }
    if(process.env.width != null){
        process.env.width = '1920';
    }
    if(process.env.height != null){
        process.env.height = '1080';
    }

    const browser = await puppeteer.launch({
        defaultViewport: {
          width: 1920,
          height: 1080
        }
    });
    const page = await browser.newPage();
    await page.goto(process.env.websiteURL);
    await page.setViewport({width: 1920, height: 1080});
    await page.screenshot({ path: 'screen.png', fullPage: true });

    await browser.close();
})();