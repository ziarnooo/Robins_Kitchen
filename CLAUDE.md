# Applewood Manor Culinary — Project Guide

> This file is the source of truth for anyone (human or LLM) working on this project.
> Update it whenever you add, change, or remove something significant.

---

## What this is

A static website + CMS for **Robin Collins**, who teaches small-group cooking and bread-baking classes at her home (Applewood Manor) in Asheville, NC. Her husband Stephen runs the related B&B at applewoodmanor.com.

**Live URL (target):** `https://applewoodculinary.com`  
**Admin/CMS URL:** `https://applewoodculinary.com/admin/`  
**GitHub repo:** `https://github.com/ziarnooo/Robins_Kitchen`  
**Contact email:** `culinary@applewoodmanor.com`

---

## Tech stack

| Layer | Tool | Why |
|-------|------|-----|
| Static site generator | **Eleventy (11ty) v3** | Minimal config, great for markdown + Nunjucks templates |
| CMS | **Decap CMS** (formerly Netlify CMS) | Free, open-source, GitHub-backed, no database |
| Auth | **GitHub OAuth PKCE** | Browser-only OAuth flow — no backend server needed |
| Hosting | **GitHub Pages** (`gh-pages` branch) | Free, auto-deploys via GitHub Actions on push to `main` |
| CI/CD | **GitHub Actions** | Runs `npm run build` → publishes `_site/` to `gh-pages` |
| DNS | **Registrar → GitHub Pages** | A records for `applewoodculinary.com` + CNAME for `www` |

---

## File structure

```
Robin's Kitchen/
├── CLAUDE.md                 ← you are here
├── PROMPT-handoff-to-build-agent.md  ← original build spec (reference only)
├── index.html                ← VISUAL SOURCE OF TRUTH — the finished design mockup
├── .eleventy.js              ← Eleventy config: collections, filters, passthrough
├── .gitignore
├── package.json
├── CNAME                     ← tells GitHub Pages the custom domain (applewoodculinary.com)
├── README.md                 ← setup instructions for future Dominik
├── ROBIN-WALKTHROUGH.md      ← plain-English guide for Robin to use the CMS
│
├── _data/
│   ├── site.json             ← site name, email, social URLs (used in templates)
│   ├── bio.json              ← Robin's 3-paragraph bio array (rendered in About section)
│   └── credentials.json      ← "Studied at" and "Cooked alongside" lists
│
├── _includes/                ← Nunjucks partials, one per section
│   ├── base.njk              ← main HTML shell: <head>, topbar, footer wrapper
│   ├── hero.njk              ← hero section (static)
│   ├── about.njk             ← bio section (reads _data/bio.md)
│   ├── credentials.njk       ← dark credentials strip (reads _data/credentials.json)
│   ├── classes.njk           ← 12-card grid (loops collections.classes)
│   ├── how-it-works.njk      ← 4-step explainer (static)
│   ├── upcoming.njk          ← date list (loops collections.upcoming)
│   ├── notes-section.njk     ← 3 note cards on homepage (loops collections.notes)
│   ├── contact.njk           ← email CTA (static)
│   └── footer.njk            ← footer (reads site.json)
│
├── admin/
│   ├── index.html            ← loads Decap CMS script — do not add content here
│   └── config.yml            ← CMS schema: 3 collections (classes, upcoming, notes)
│
├── content/
│   ├── classes/              ← 12 markdown files, one per class Robin teaches
│   ├── upcoming/             ← markdown files for specific teaching dates
│   └── notes/                ← Robin's blog posts (each gets its own page)
│
├── images/                   ← all photos; passed through to _site unchanged
│   └── ...                   ← see "Images" section below for correct mapping
│
├── notes/
│   └── _index.njk            ← pagination template: creates /notes/<slug>/ pages
│
└── index.njk                 ← homepage: front matter + {% include %} for each section
```

---

## How Eleventy builds the site

1. `npm run build` (or `npm run dev` for local with live-reload) runs Eleventy.
2. Eleventy reads `index.njk` → applies `base.njk` layout → includes each section partial.
3. Collections are defined in `.eleventy.js`:
   - `classes` — all `content/classes/*.md` files
   - `upcoming` — all `content/upcoming/*.md` files
   - `notes` — all `content/notes/*.md` files
4. Templates filter/sort collections with custom filters (also in `.eleventy.js`).
5. Output goes to `_site/` — **never edit `_site/` directly**, it is regenerated on every build.

---

## Collections & CMS schema

### Classes (`content/classes/*.md`)

Robin's catalog — 12 entries at launch, rarely changes.

Key fields: `title`, `number` (sort order), `category`, `tag_short`, `duration`, `image`, `description`, `price_line`, `show_in_catalog`, `active`.

To add a class: create a new `.md` file in `content/classes/` with the required front matter, OR use the CMS at `/admin/`.

To hide a class without deleting: set `active: false` in front matter.

### Upcoming Dates (`content/upcoming/*.md`)

Specific calendar dates Robin teaches. **This is what Robin edits most often.**

Key fields: `date` (YYYY-MM-DD), `class_relation` (must match a class `title` exactly), `class_title` (display name, can be more specific), `time_description`, `seats_available`, `status`.

Template shows only future dates where `status != "Cancelled"`, sorted by date ascending.

### Notes (`content/notes/*.md`)

Robin's blog. Each note gets its own page at `/notes/<slug>/`.

Key fields: `title`, `date`, `category`, `excerpt`, `featured` (boolean — one note can be featured/large on homepage), `published` (set to `false` to draft).

Homepage shows the 3 most recent published notes. Featured note appears first/large.

---

## Images

**Important:** The image *filenames* do not always match the actual photo content — they were created with mixed-up names. The mapping of what each file *actually shows*:

| Filename | Actual content | Used for class |
|----------|---------------|----------------|
| `starter.jpg` | Vegetable quiche/tarts | Pie Crust (#11) |
| `pain-campagne.jpg` | Lebanese meat pies | Meat & Spinach Pies (#10) |
| `bagels.jpg` | Whole-grain sandwich loaves | Whole-Grain Sandwich Bread (#5) |
| `bolognese.jpg` | Kitchen interior | (gallery / Build Your Own) |
| `cinnamon-knots.jpg` | Cinnamon swirl cookies | Twisted Cinnamon Buns (#3) |
| `cinnamon-swirls.jpg` | Fresh pasta (tagliatelle) | Homemade Pasta (#7) |
| `meatpies.jpg` | Bolognese meat sauce | Lasagna with Bolognese (#8) |
| `pasta.jpg` | Dough rising in container | Fermented Bread (#2) |
| `quiche.jpg` | White bread/baguette loaves | White Dough (#1) |
| `sandwich-bread.jpg` | Ratatouille | (unused / Build Your Own) |
| `kitchen.jpg` | Sesame bagels on sheet pan | Bagels (#4) |
| `ratatouille.jpg` | Ratatouille in Staub pan | Build Your Own (#12) |
| `hero-flour.jpg` | Flour being dusted on dough | Hero section, Notes |
| `hero-hands.jpg` | Hands shaping baguette | Hero section |
| `logo.jpg` | Applewood Manor logo | Topbar, footer |

**To add a new photo:** put it in `images/`, then update the relevant class markdown file's `image` field (or use the CMS image uploader which saves to `images/` automatically).

**To replace a photo:** overwrite the file in `images/` keeping the same filename, or upload a new file via CMS and update the `image` field.

---

## Filters (`.eleventy.js`)

| Filter | Input | Output | Used in |
|--------|-------|--------|---------|
| `dateDay` | date string | `"17"` (zero-padded day) | `upcoming.njk` |
| `dateMonth` | date string | `"May"` | `upcoming.njk` |
| `dateFull` | date string | `"May 17, 2026"` | note pages |
| `futureOnly` | collection array | dates ≥ today only | `upcoming.njk` |
| `byDateAsc` | collection array | sorted oldest→newest | `upcoming.njk` |
| `byDateDesc` | collection array | sorted newest→oldest | `notes-section.njk` |
| `publishedOnly` | collection array | `published: true` only | `notes-section.njk` |
| `inCatalog` | collection array | `active: true` + `show_in_catalog: true` | `classes.njk` |
| `byNumberAsc` | collection array | sorted by `number` field | `classes.njk` |

---

## Decap CMS (`admin/config.yml`)

- **Backend:** GitHub OAuth via **Netlify OAuth proxy** (`base_url: https://api.netlify.com`) — Netlify acts as the OAuth middleman, site is still hosted on GitHub Pages
- **Netlify site:** `gleaming-froyo-4a9351.netlify.app` (connected to the same repo, used only for OAuth)
- **`site_domain`:** set to `gleaming-froyo-4a9351.netlify.app` so Netlify can match the OAuth credentials
- **Media folder:** `images/` — uploads go here, public path is `/images/`
- **Login URL:** `https://applewoodculinary.com/admin/`

To add a new CMS field: edit `admin/config.yml`, add the field under the correct collection, then add the corresponding variable reference in the relevant `_includes/*.njk` template.

---

## Local development

```bash
npm run dev        # starts dev server at http://localhost:8080 with live reload
npm run build      # one-off build to _site/
npm run clean      # deletes _site/
```

Requires Node 20+. Install dependencies first: `npm install`.

---

## Deployment

GitHub Actions builds and deploys automatically on every push to `main`.

Workflow file: `.github/workflows/deploy.yml`

1. Checks out code
2. Installs Node 20 + runs `npm ci`
3. Runs `npm run build` → outputs to `_site/`
4. Pushes `_site/` contents to `gh-pages` branch via `peaceiris/actions-gh-pages`

The `gh-pages` branch is what GitHub Pages serves. **Never edit `gh-pages` directly.**

**If the build fails:** check the Actions tab in the GitHub repo. Common causes:
- Missing front matter field in a markdown file
- Nunjucks syntax error in a template
- Image referenced in markdown but file not in `images/`

---

## Decap CMS setup (one-time, done by Dominik)

CMS uses **Netlify OAuth proxy** — Netlify acts as the OAuth middleman between the browser and GitHub. The site itself is hosted on GitHub Pages; Netlify is only used for authentication.

**What's already configured:**
- Netlify site: `gleaming-froyo-4a9351.netlify.app` (repo connected, OAuth provider installed)
- GitHub OAuth App: callback URL `https://api.netlify.com/auth/done`, credentials stored in Netlify

**If you ever need to redo this from scratch:**
1. Create a GitHub OAuth App:
   - Homepage URL: `https://applewoodculinary.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Copy **Client ID** and **Client Secret** (both needed)
2. Create a Netlify account, connect the `ziarnooo/Robins_Kitchen` repo
3. In Netlify: Site configuration → Access & security → OAuth → Install provider → GitHub → paste Client ID + Secret
4. Ensure `admin/config.yml` has:
   ```yaml
   backend:
     name: github
     repo: ziarnooo/Robins_Kitchen
     branch: main
     base_url: https://api.netlify.com
     site_domain: gleaming-froyo-4a9351.netlify.app
   ```

**Note:** GitHub PKCE OAuth does not work reliably with either Decap CMS or Sveltia CMS — use Netlify OAuth proxy.

---

## DNS & domain

Target domain: `applewoodculinary.com` (apex/naked domain)

**At the DNS registrar (wherever `applewoodculinary.com` is registered):**

Add four A records pointing to GitHub Pages IPs:
- Type: `A`, Name: `@`, Value: `185.199.108.153`
- Type: `A`, Name: `@`, Value: `185.199.109.153`
- Type: `A`, Name: `@`, Value: `185.199.110.153`
- Type: `A`, Name: `@`, Value: `185.199.111.153`

Add a CNAME for www:
- Type: `CNAME`, Name: `www`, Value: `ziarnooo.github.io`
- TTL: 1 hour (all records)

**In GitHub repo settings → Pages:**
- Source: `gh-pages` branch
- Custom domain: `applewoodculinary.com`
- Enable "Enforce HTTPS" once certificate provisions (~10 min after DNS propagates)

The `CNAME` file in the repo root is already set to `applewoodculinary.com` — GitHub Pages reads it on deploy.

---

## Build status

| Step | Status | Notes |
|------|--------|-------|
| Repo init + npm + Eleventy install | ✅ done | `@11ty/eleventy ^3.1.5` |
| `.eleventy.js` | ✅ done | collections, 9 filters, passthrough |
| `package.json` scripts | ✅ done | dev / build / clean |
| `.gitignore` | ✅ done | |
| `.github/workflows/deploy.yml` | ✅ done | GitHub Actions → gh-pages |
| `CNAME` | ✅ done | applewoodculinary.com |
| `admin/index.html` + `config.yml` | ✅ done | Decap CMS, 3 collections, Netlify OAuth proxy |
| `_data/site.json` | ✅ done | |
| `_data/bio.json` | ✅ done | |
| `_data/credentials.json` | ✅ done | |
| `content/classes/` (12 files) | ✅ done | correct images per class |
| `content/upcoming/` (5 files) | ✅ done | dates 2026-05 → 2026-12 |
| `content/notes/` (3 files) | ✅ done | placeholder content, Robin to replace |
| Eleventy templates (`_includes/`) | ✅ done | 10 partials, gallery removed |
| `index.njk` homepage | ✅ done | |
| `notes/index.njk` | ✅ done | pagination, 3 pages generated |
| Local dev test | ✅ done | 12 cards, 5 dates, 3 notes, 4 HTML files |
| Git commit + push | ✅ done | |
| GitHub repo Pages settings | ✅ done | gh-pages branch, applewoodculinary.com |
| Netlify OAuth proxy | ✅ done | gleaming-froyo-4a9351.netlify.app |
| Custom domain DNS | ✅ done | A records + CNAME www at registrar |
| Google Analytics (gtag.js) | ✅ done | G-3TQFMR9N1F, added to base.njk `<head>` |
| Class cards → Book this class link | ✅ done | `.class-card` is now `<a href="/#contact">` |
| ROBIN-WALKTHROUGH.md | ⏳ pending | |

---

## What Robin can edit (via CMS)

- Add / edit / delete upcoming class dates
- Write and publish Notes (blog posts)
- Change class descriptions, photos, prices
- Draft notes without publishing (`published: false`)

## What requires a developer

- Adding a new section to the homepage
- Changing fonts, colors, layout
- Adding a new CMS field type
- Changing the domain or hosting provider
