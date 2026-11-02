<div align="center">

# 📸 ScreenWebSite

**Transformez n'importe quelle page web en capture d'écran PNG — depuis votre terminal ou directement via GitHub Actions.**

[![Screen Website](https://github.com/LeGitHubDeTai/ScreenWebSite/actions/workflows/screen.yml/badge.svg)](https://github.com/LeGitHubDeTai/ScreenWebSite/actions/workflows/screen.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

[🇺🇸 English](README.md) · 🇫🇷 **Français**

</div>

---

## ✨ Fonctionnalités

- 🖥️ **Page entière ou zone visible** — capturez une page de 30 000 px, ou exactement ce qui tient à l'écran
- 📐 **Dimensions personnalisées** — définissez la largeur et la hauteur du viewport
- 🔌 **Trois façons de configurer** — argument en ligne de commande, variables d'environnement, ou le formulaire GitHub Actions
- ⚙️ **Prêt à l'emploi** — valeurs par défaut raisonnables, aucune configuration obligatoire
- 🤖 **Pensé pour la CI** — la capture est téléchargeable en artifact

## 📦 Prérequis

- [Node.js](https://nodejs.org) **18 ou supérieur**
- npm (inclus avec Node.js)

## 🚀 Démarrage rapide

```sh
git clone https://github.com/LeGitHubDeTai/ScreenWebSite.git
cd ScreenWebSite
npm install
npm start
```

## 🛠 Utilisation

### Basique

```sh
npm start
```

### Avec des options

**Syntaxe par drapeaux** — ne contient aucun guillemet : elle se comporte à l'identique sous PowerShell, cmd, bash et zsh :

```sh
npm run screen -- --websiteURL=https://taistudio.fr --width=1600 --height=900 --fullpage=false
```

**Syntaxe JSON** — un objet unique, pratique sous Linux et macOS :

```sh
npm run screen -- --props='{"websiteURL":"https://taistudio.fr","width":1600,"height":900,"fullpage":false}'
```

> ⚠️ Le `--` est obligatoire : il indique à npm de transmettre ce qui suit au script.
>
> 💻 **PowerShell et cmd avalent les guillemets** du JSON — utilisez la syntaxe par drapeaux, qui est aussi la plus courte.

### Options

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `websiteURL` | chaîne | `https://taistudio.fr` | URL de la page à capturer |
| `width` | entier | `1920` | Largeur du viewport, en pixels |
| `height` | entier | `1080` | Hauteur du viewport, en pixels |
| `fullpage` | booléen | `true` | `true` = toute la page défilable · `false` = la zone visible uniquement |

Chaque option peut être passée sous la forme `--option=valeur`, ou via l'objet JSON `--props`.

`fullpage` accepte `true` / `false`, `1` / `0`, `yes` / `no`, `on` / `off` (sans distinction de casse).

### Sources de configuration

Les valeurs sont résolues dans cet ordre — la première source qui fournit une valeur gagne :

| # | Source | Usage courant |
| --- | --- | --- |
| 1 | Drapeaux `--option=valeur` | surcharge rapide, fonctionne dans tous les shells |
| 2 | Argument JSON `--props='{...}'` | plusieurs options en une fois |
| 3 | Variable d'environnement `WORKFLOW_INPUT` | définie automatiquement par GitHub Actions |
| 4 | Fichier `.env` (chargé par [dotenv](https://github.com/motdotla/dotenv)) | configuration locale persistante |
| 5 | Valeurs par défaut | rien de configuré |

Si une source contient du JSON invalide, la suivante est essayée automatiquement — les drapeaux restent utilisables. Une erreur explicite n'est levée que si **rien** n'a pu être lu.

### Utiliser un fichier `.env`

```sh
cp .env.example .env
```

```ini
websiteURL=https://taistudio.fr
width=1920
height=1080
fullpage=true
```

`.env` est ignoré par git — votre configuration ne quitte jamais votre machine.

> 💻 **Windows / PowerShell** : si vous préférez tout de même la syntaxe JSON, échappez les guillemets avec une barre oblique inverse :
>
> ```powershell
> npm run screen -- '--props={\"websiteURL\":\"https://taistudio.fr\",\"fullpage\":false}'
> ```
>
> ou reposez simplement sur un fichier `.env` — les deux fonctionnent avec `npm start`.

## 🤖 Exécuter via GitHub Actions

Le workflow se trouve dans [`.github/workflows/screen.yml`](.github/workflows/screen.yml) et se déclenche manuellement.

1. Ouvrez l'onglet **Actions** du dépôt
2. Sélectionnez **Screen Website** dans la barre latérale
3. Cliquez sur **Run workflow**, remplissez le formulaire et validez
4. Une fois le run terminé, téléchargez l'artifact **`screen`** — il contient `screen.png`

| Entrée | Type | Défaut | Description |
| --- | --- | --- | --- |
| `websiteURL` | chaîne | `https://taistudio.fr` | URL de la page à capturer |
| `width` | chaîne | `1920` | Largeur du viewport, en pixels |
| `height` | chaîne | `1080` | Hauteur du viewport, en pixels |
| `fullpage` | booléen | `true` | Capturer la page entière au lieu de la seule zone visible |

## 🔧 Fonctionnement

1. La configuration est lue depuis les sources ci-dessus, par ordre de priorité
2. Puppeteer lance un Chromium headless avec le viewport demandé
3. La page est chargée puis capturée dans `screen.png`
4. En CI, le fichier est téléversé en artifact

> 🛡️ Certains systèmes interdisent le sandbox de Chrome (Ubuntu 23.10+, AppArmor restreignant les user namespaces, runners de CI). Chromium est alors relancé automatiquement une fois avec `--no-sandbox`.

## 🧪 Tests

```sh
npm test
```

La suite couvre chaque source de configuration, les replis entre elles, les valeurs par défaut, le traitement des valeurs invalides, les dimensions réelles produites par `fullpage` (zone visible vs. page entière) et la relance automatique `--no-sandbox`.

## 📁 Structure du projet

```text
ScreenWebSite/
├── .github/
│   └── workflows/
│       └── screen.yml        # Workflow GitHub Actions
├── .env.example              # modèle de configuration
├── browser.js                # lancement de Chromium + repli sans sandbox
├── main.js                   # point d'entrée (Puppeteer)
├── test-env.js               # suite de tests
├── package.json
├── README.md                 # documentation anglaise
└── README.fr.md              # documentation française
```

## ❓ Dépannage

| Symptôme | Solution |
| --- | --- |
| `Impossible de lire les propriétés JSON` | Le shell a mangé les guillemets — passez à la syntaxe par drapeaux (`--websiteURL=...`) ou utilisez un fichier `.env` |
| `No usable sandbox!` | Pris en charge automatiquement : Chromium est relancé avec `--no-sandbox` |
| Les valeurs de mon `.env` sont ignorées | `--props` et `WORKFLOW_INPUT` priment sur `.env` |
| Où est la capture ? | `screen.png`, à la racine du projet (ignoré par git) |

## 📄 Licence

[MIT](LICENSE) © Tai Studio
