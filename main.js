/*-------------------------------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     _____   ___ ___  ___   |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |   / /__ \ / _ \__ \|__ \  |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |  / /   ) | | | | ) |  ) | |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | | / /   / /| | | |/ /  / /  |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |/ /   / /_| |_| / /_ / /_  |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_/_/   |____|\___/____|____| |
|                                                   \________/                                                 |
\-------------------------------------------------------------------------------------------------------------*/

const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
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