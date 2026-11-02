const puppeteer = require('puppeteer');

// Arguments qui désactivent le sandbox de Chrome (contournement documenté
// par Chromium lui-même : https://chromium.googlesource.com/chromium/src/+/main/docs/security/apparmor-userns-restrictions.md)
const NO_SANDBOX_ARGS = ['--no-sandbox', '--disable-setuid-sandbox'];

// Lance Chromium.
//
// Certains systèmes empêchent Chrome de créer son sandbox : Ubuntu 23.10+ et
// les distributions qui restreignent les user namespaces via AppArmor (c'est le
// cas des runners GitHub), ce qui provoque un échec immédiat "No usable sandbox!".
//
// On tente d'abord le lancement normal (sandbox actif, plus sûr) puis on
// retente une seule fois sans sandbox si — et seulement si — l'échec y est lié.
async function launchBrowser(options, launch) {
    const doLaunch = launch || ((launchOptions) => puppeteer.launch(launchOptions));

    try {
        return await doLaunch(options);
    } catch (error) {
        const message = String((error && error.message) || error);
        const alreadyWithoutSandbox = (options.args || []).includes('--no-sandbox');

        // On ne retente que sur une erreur de sandbox explicite, pour ne pas
        // masquer une autre panne (URL invalide, Chrome absent, etc.)
        if (alreadyWithoutSandbox || !/sandbox/i.test(message)) {
            throw error;
        }

        console.warn('Sandbox Chrome indisponible sur ce système -> relance avec --no-sandbox.');

        return doLaunch({
            ...options,
            args: [...(options.args || []), ...NO_SANDBOX_ARGS]
        });
    }
}

module.exports = { launchBrowser, NO_SANDBOX_ARGS };
