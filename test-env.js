/*-----------------------------------------------------------------------------------------\
|  _______                 _____  .               _                ___    ___/  ___    __  |
| '   /      ___  `       (      _/_   ,   .   ___/ `   __.       /   \ .'  /\ /   \ .'    |
|     |     /   ` |        `--.   |    |   |  /   | | .'   \        _-' |  / |   _-' |---. |
|     |    |    | |           |   |    |   | ,'   | | |    |       /    |,'  |  /    |   | |
|     /    `.__/| /      \___.'   \__/ `._/| `___,' /  `._.'      /___, /`---' /___, `._.' |
|                                                 `                                        |
\-----------------------------------------------------------------------------------------*/
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');

const MAIN = path.join(__dirname, 'main.js');

// Les tests tournent dans un dossier temporaire : le ".env" local (non tracké)
// ne fausse jamais les résultats, et screen.png n'est jamais écrasé.
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'screenweb-'));

// Variables retirées de l'environnement pour repartir de zéro
const RESET = ['websiteURL', 'width', 'height', 'fullpage', 'WORKFLOW_INPUT'];

function run(args, env) {
    const baseEnv = { ...process.env };
    for (const key of RESET) delete baseEnv[key];

    const r = spawnSync(process.execPath, [MAIN, ...args], {
        encoding: 'utf8',
        cwd: TMP,
        env: { ...baseEnv, ...(env || {}) }
    });

    const raw = (r.stdout || '') + (r.stderr || '');
    // Aplatir les sauts de ligne : une URL peut en contenir (échappement JSON)
    // et un message d'erreur part dans stderr. On assert donc sur tout le texte.
    const flat = raw.replace(/\s+/g, ' ').trim();
    const matches = flat.match(/Screen .*?\[(?:full page|viewport only)\]/g) || [];
    const out = matches.join(' | ') || flat.slice(0, 160);

    console.log(`exit=${r.status} :: ${out}`);
    return { status: r.status, out, flat };
}

// Lit la taille (en pixels) d'un PNG via son en-tête IHDR
function pngSize(file) {
    const b = fs.readFileSync(file);
    if (!(b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)) {
        throw new Error('fichier PNG invalide');
    }
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

const cases = [
    { label: 'defauts', args: [], exit: 0, expect: 'Screen https://taistudio.fr (1920x1080) [full page]' },
    {
        label: '--props complet',
        args: ['--props={"websiteURL":"https://example.com","width":"1280","height":"720","fullpage":false}'],
        exit: 0,
        expect: 'Screen https://example.com (1280x720) [viewport only]'
    },
    {
        label: 'WORKFLOW_INPUT',
        args: [],
        env: { WORKFLOW_INPUT: '{"websiteURL":"https://example.com","width":"1280","height":"720","fullpage":"true"}' },
        exit: 0,
        expect: 'Screen https://example.com (1280x720) [full page]'
    },
    { label: '--props partiel', args: ['--props={"websiteURL":"https://example.com"}'], exit: 0, expect: 'https://example.com (1920x1080)' },
    {
        label: 'valeurs invalides',
        args: ['--props={"websiteURL":"https://example.com\\n\\n","width":"abc","height":"-5","fullpage":"peut-etre"}'],
        exit: 0,
        expect: '(1920x1080) [full page]'
    },
    { label: 'JSON invalide -> erreur claire', args: ['--props={broken'], exit: 1, expect: 'Impossible de lire les propriétés JSON' },
    {
        label: '--props casse -> repli WORKFLOW_INPUT',
        args: ['--props={broken'],
        env: { WORKFLOW_INPUT: '{"websiteURL":"https://example.com","width":"1280"}' },
        exit: 0,
        expect: 'Run With Github Action !'
    },
    { label: 'toutes les sources cassees', args: ['--props={broken'], env: { WORKFLOW_INPUT: 'not json either' }, exit: 1 },
    {
        label: 'commande du README (\\n litteraux)',
        args: ['--props={\\n  "height": "768",\\n  "websiteURL": "https://example.com",\\n  "width": "1024"\\n}'],
        exit: 0,
        expect: '(1024x768)'
    },
    { label: 'fullpage=false via variable env', args: [], env: { fullpage: 'false' }, exit: 0, expect: '[viewport only]' },
    { label: 'fullpage=true via variable env', args: [], env: { fullpage: 'yes' }, exit: 0, expect: '[full page]' },
    { label: 'fullpage booleen JSON false', args: ['--props={"fullpage":false}'], exit: 0, expect: '[viewport only]' }
];

let failed = 0;

console.log('--- Variables d\'environnement ---');
for (const c of cases) {
    const r = run(c.args, c.env);
    let ok = r.status === c.exit;
    if (ok && c.expect && !r.flat.includes(c.expect)) {
        ok = false;
        console.log(`       ^ attendu : ${c.expect}`);
    }
    if (!ok) failed++;
    console.log(`  ${ok ? 'OK ' : 'KO '} ${c.label} (exit attendu ${c.exit})`);
}

console.log('\n--- Capture full page / viewport ---');

// Page de 4000 px de haut générée à la volée : sert à prouver que fullpage change
// réellement les dimensions du PNG, pas seulement le message affiché.
const tall = path.join(TMP, 'tall.html');
fs.writeFileSync(
    tall,
    '<!doctype html><html><head><meta charset="utf-8">' +
        '<style>html,body{margin:0;height:4000px;background:#fff}</style></head>' +
        '<body></body></html>'
);
const tallURL = pathToFileURL(tall).href;
const shot = path.join(TMP, 'screen.png');

const captures = [
    {
        label: 'fullpage=false -> image = viewport',
        args: [`--props={"websiteURL":"${tallURL}","width":"800","height":"600","fullpage":false}`],
        expect: { width: 800, height: 600 },
        expectLog: '[viewport only]'
    },
    {
        label: 'fullpage=true -> image = page entiere',
        args: [`--props={"websiteURL":"${tallURL}","width":"800","height":"600","fullpage":true}`],
        expect: { width: 800, minheight: 4000 },
        expectLog: '[full page]'
    }
];

for (const c of captures) {
    if (fs.existsSync(shot)) fs.unlinkSync(shot);
    const r = run(c.args);
    let ok = r.status === 0;
    if (ok && c.expectLog && !r.flat.includes(c.expectLog)) ok = false;

    let size = null;
    if (ok) {
        if (!fs.existsSync(shot)) {
            ok = false;
            console.log('       ^ aucun screen.png produit');
        } else {
            size = pngSize(shot);
            ok =
                size.width === c.expect.width &&
                (c.expect.height !== undefined ? size.height === c.expect.height : size.height >= c.expect.minheight);
        }
    }

    if (!ok) failed++;
    console.log(`  ${ok ? 'OK ' : 'KO '} ${c.label} -> ${size ? `${size.width}x${size.height}` : 'n/a'}`);
}

console.log(failed === 0 ? '\nTOUS LES TESTS PASSENT' : `\n${failed} TEST(S) EN ECHEC`);

try {
    fs.rmSync(TMP, { recursive: true, force: true });
} catch (error) {
    // le dossier temporaire sera purgé par le système
}

process.exit(failed === 0 ? 0 : 1);
