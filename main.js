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

const DEFAULT_URL = 'https://taistudio.fr';
const DEFAULT_WIDTH = 1920;
const DEFAULT_HEIGHT = 1080;
const DEFAULT_FULLPAGE = true;

// Analyse une chaîne JSON : certains shells laissent des "\n" littéraux
function parseProps(raw) {
    try {
        return JSON.parse(raw);
    } catch (error) {
        try {
            return JSON.parse(raw.replace(/\\n/g, ' '));
        } catch (fallbackError) {
            throw new Error(`Impossible de lire les propriétés JSON : ${raw}`);
        }
    }
}

// Liste les sources de propriétés, de la plus prioritaire à la moins prioritaire
function getSources() {
    const sources = [];

    const arg = process.argv.find((value) => value.startsWith('--props='));
    if (arg !== undefined) {
        sources.push({ name: '--props', raw: arg.slice('--props='.length) });
    }

    if (process.env.WORKFLOW_INPUT != null && process.env.WORKFLOW_INPUT.trim() !== '') {
        sources.push({ name: 'WORKFLOW_INPUT', raw: process.env.WORKFLOW_INPUT });
    }

    return sources;
}

// Lit les propriétés : argument "--props={...}" puis variable d'environnement WORKFLOW_INPUT.
// Si une source est illisible (JSON altéré par le shell, par exemple), on passe à la suivante.
function readProps() {
    const sources = getSources();
    let firstError = null;

    for (const source of sources) {
        try {
            return parseProps(source.raw);
        } catch (error) {
            firstError = firstError || error;
            console.warn(`Source "${source.name}" illisible, on essaie la suivante...`);
        }
    }

    if (firstError !== null) {
        throw firstError;
    }

    return {};
}

// Convertit une valeur en entier positif, sinon renvoie la valeur par défaut
function toInt(value, fallback) {
    const parsed = parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// Convertit une valeur en booléen (true/false, 1/0, yes/no, on/off), sinon valeur par défaut
function toBool(value, fallback) {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }
    if (typeof value === 'boolean') {
        return value;
    }

    const normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;

    return fallback;
}

(async () => {
    const props = readProps();

    if (process.env.WORKFLOW_INPUT != null && process.env.WORKFLOW_INPUT.trim() !== '') {
        console.log('Run With Github Action !');
    }

    // Priorité : --props / WORKFLOW_INPUT > variables d'environnement (.env) > valeurs par défaut
    // On teste explicitement `undefined` : `false` est une valeur valide et ne doit pas
    // être écrasée par l'opérateur ||
    const websiteURL = props.websiteURL || process.env.websiteURL || DEFAULT_URL;
    const width = toInt(props.width || process.env.width, DEFAULT_WIDTH);
    const height = toInt(props.height || process.env.height, DEFAULT_HEIGHT);
    const fullPage = toBool(
        props.fullpage !== undefined ? props.fullpage : process.env.fullpage,
        DEFAULT_FULLPAGE
    );

    console.log(`Screen ${websiteURL} (${width}x${height}) [${fullPage ? 'full page' : 'viewport only'}]`);

    const browser = await puppeteer.launch({
        defaultViewport: {
            width: width,
            height: height
        }
    });
    const page = await browser.newPage();
    await page.setViewport({ width: width, height: height });
    await page.goto(websiteURL);
    await page.screenshot({ path: 'screen.png', fullPage: fullPage });

    await browser.close();
})();
