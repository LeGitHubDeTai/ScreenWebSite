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

```sh
npm run screen -- --props='{"websiteURL":"https://taistudio.fr","width":1600,"height":900,"fullpage":false}'
```

> ⚠️ Le `--` est obligatoire : il indique à npm de transmettre ce qui suit au script.

### Options

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `websiteURL` | chaîne | `https://taistudio.fr` | URL de la page à capturer |
| `width` | entier | `1920` | Largeur du viewport, en pixels |
| `height` | entier | `1080` | Hauteur du viewport, en pixels |
| `fullpage` | booléen | `true` | `true` = toute la page défilable · `false` = la zone visible uniquement |

`fullpage` accepte `true` / `false`, `1` / `0`, `yes` / `no`, `on` / `off` (sans distinction de casse).

### Sources de configuration

Les valeurs sont résolues dans cet ordre — la première source qui fournit une valeur gagne :

| # | Source | Usage courant |
| --- | --- | --- |
| 1 | Argument `--props='{...}'` | exécution ponctuelle depuis un terminal |
| 2 | Variable d'environnement `WORKFLOW_INPUT` | définie automatiquement par GitHub Actions |
| 3 | Fichier `.env` (chargé par [dotenv](https://github.com/motdotla/dotenv)) | configuration locale persistante |
| 4 | Valeurs par défaut | rien de configuré |

Si une source contient du JSON invalide, la suivante est essayée automatiquement ; une erreur explicite n'est levée que si **toutes** les sources échouent.

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

> 💻 **Windows / PowerShell** : PowerShell supprime les guillemets du JSON, préférez donc le fichier `.env`. Si vous avez besoin de la ligne de commande, échappez les guillemets avec une barre oblique inverse :
>
> ```powershell
> npm run screen -- '--props={\"websiteURL\":\"https://taistudio.fr\",\"fullpage\":false}'
> ```

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

## 🧪 Tests

```sh
npm test
```

La suite couvre chaque source de configuration, les replis entre elles, les valeurs par défaut, le traitement des valeurs invalides et les dimensions réelles produites par `fullpage` (zone visible vs. page entière).

## 📁 Structure du projet

```text
ScreenWebSite/
├── .github/
│   └── workflows/
│       └── screen.yml        # Workflow GitHub Actions
├── .env.example              # modèle de configuration
├── main.js                   # point d'entrée (Puppeteer)
├── test-env.js               # suite de tests
├── package.json
├── README.md                 # documentation anglaise
└── README.fr.md              # documentation française
```

## ❓ Dépannage

| Symptôme | Solution |
| --- | --- |
| `Impossible de lire les propriétés JSON` | Le shell a mangé les guillemets — voir la note PowerShell ci-dessus, ou utilisez un fichier `.env` |
| Les valeurs de mon `.env` sont ignorées | `--props` et `WORKFLOW_INPUT` priment sur `.env` |
| Où est la capture ? | `screen.png`, à la racine du projet (ignoré par git) |

## 📄 Licence

[MIT](LICENSE) © Tai Studio
