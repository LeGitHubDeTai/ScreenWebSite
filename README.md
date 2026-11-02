<div align="center">

# 📸 ScreenWebSite

**Turn any web page into a PNG screenshot — from your terminal or straight from GitHub Actions.**

[![Screen Website](https://github.com/LeGitHubDeTai/ScreenWebSite/actions/workflows/screen.yml/badge.svg)](https://github.com/LeGitHubDeTai/ScreenWebSite/actions/workflows/screen.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)

🇺🇸 **English** · [🇫🇷 Français](README.fr.md)

</div>

---

## ✨ Features

- 🖥️ **Full page or viewport only** — capture a 30 000 px long page, or exactly what fits on screen
- 📐 **Custom dimensions** — set the viewport width and height you need
- 🔌 **Three ways to configure** — CLI argument, environment variables, or the GitHub Actions form
- ⚙️ **Works out of the box** — sensible defaults, zero configuration required
- 🤖 **CI ready** — the screenshot is uploaded as a downloadable artifact

## 📦 Requirements

- [Node.js](https://nodejs.org) **18 or later**
- npm (bundled with Node.js)

## 🚀 Quick start

```sh
git clone https://github.com/LeGitHubDeTai/ScreenWebSite.git
cd ScreenWebSite
npm install
npm start
```

## 🛠 Usage

### Basic

```sh
npm start
```

### With options

**Flag syntax** — contains no quote, so it behaves identically in PowerShell, cmd, bash and zsh:

```sh
npm run screen -- --websiteURL=https://taistudio.fr --width=1600 --height=900 --fullpage=false
```

**JSON syntax** — a single object, handy on Linux and macOS:

```sh
npm run screen -- --props='{"websiteURL":"https://taistudio.fr","width":1600,"height":900,"fullpage":false}'
```

> ⚠️ The `--` is required: it tells npm to forward everything that follows to the script.
>
> 💻 **PowerShell and cmd swallow the double quotes** of the JSON — use the flag syntax there. It is also the shortest.

### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `websiteURL` | string | `https://taistudio.fr` | URL of the page to capture |
| `width` | integer | `1920` | Viewport width, in pixels |
| `height` | integer | `1080` | Viewport height, in pixels |
| `fullpage` | boolean | `true` | `true` = the entire scrollable page · `false` = the viewport only |

Every option can be passed as `--option=value`, or through the `--props` JSON object.

`fullpage` accepts `true` / `false`, `1` / `0`, `yes` / `no`, `on` / `off` (case-insensitive).

### Configuration sources

Values are resolved in this order — the first source that provides a value wins:

| # | Source | Typical use |
| --- | --- | --- |
| 1 | `--option=value` command-line flags | quick override, works in every shell |
| 2 | `--props='{...}'` JSON argument | several options at once |
| 3 | `WORKFLOW_INPUT` environment variable | set automatically by GitHub Actions |
| 4 | `.env` file (loaded by [dotenv](https://github.com/motdotla/dotenv)) | persistent local configuration |
| 5 | Built-in defaults | nothing configured |

If a source contains invalid JSON, the next one is tried automatically — the flags still apply. An explicit error is raised only when nothing could be read at all.

### Using a `.env` file

```sh
cp .env.example .env
```

```ini
websiteURL=https://taistudio.fr
width=1920
height=1080
fullpage=true
```

`.env` is git-ignored — your configuration never leaves your machine.

> 💻 **Windows / PowerShell:** if you still want to use the JSON syntax, escape the quotes with a backslash:
>
> ```powershell
> npm run screen -- '--props={\"websiteURL\":\"https://taistudio.fr\",\"fullpage\":false}'
> ```
>
> or simply rely on a `.env` file — both are covered by `npm start`.

## 🤖 Run with GitHub Actions

The workflow lives in [`.github/workflows/screen.yml`](.github/workflows/screen.yml) and is triggered manually.

1. Open the **Actions** tab of the repository
2. Select **Screen Website** in the sidebar
3. Click **Run workflow**, fill in the form and hit the green button
4. Once the run finishes, download the **`screen`** artifact — it contains `screen.png`

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `websiteURL` | string | `https://taistudio.fr` | URL of the page to capture |
| `width` | string | `1920` | Viewport width, in pixels |
| `height` | string | `1080` | Viewport height, in pixels |
| `fullpage` | boolean | `true` | Capture the full page instead of only the viewport |

## 🔧 How it works

1. Configuration is read from the sources above, in priority order
2. Puppeteer launches a headless Chromium with the requested viewport
3. The page is loaded and captured to `screen.png`
4. In CI, the file is uploaded as an artifact

> 🛡️ Some systems forbid Chrome's sandbox (Ubuntu 23.10+, AppArmor restricting user namespaces, CI runners). Chromium is then automatically relaunched once with `--no-sandbox`.

## 🧪 Tests

```sh
npm test
```

The suite covers every configuration source, the fallback between them, the default values, the invalid-value handling, the actual pixel dimensions produced by `fullpage` (viewport vs. full page) and the automatic `--no-sandbox` retry.

## 📁 Project structure

```text
ScreenWebSite/
├── .github/
│   └── workflows/
│       └── screen.yml        # GitHub Actions workflow
├── .env.example              # configuration template
├── browser.js                # Chromium launch + sandbox fallback
├── main.js                   # entry point (Puppeteer)
├── test-env.js               # test suite
├── package.json
├── README.md                 # English documentation
└── README.fr.md              # French documentation
```

## ❓ Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Impossible de lire les propriétés JSON` | The shell ate the quotes — switch to the flag syntax (`--websiteURL=...`) or use a `.env` file |
| `No usable sandbox!` | Handled automatically: Chromium is relaunched with `--no-sandbox` |
| My `.env` values are ignored | `--props` and `WORKFLOW_INPUT` take precedence over `.env` |
| Where is the screenshot? | `screen.png`, in the project root (git-ignored) |

## 📄 License

[MIT](LICENSE) © Tai Studio
