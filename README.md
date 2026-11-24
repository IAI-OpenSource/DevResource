# DevResources

A collaborative directory of technology and programming resources, built by the students of **IAI-Togo** for the **IAI Programming Club**.

It is a frontend-only React app. There is no backend, database or API. **Every resource is one small JSON file**, and the app discovers those files automatically.

> **Discover. Learn. Build.**

---

## Table of contents

1. [Quick start](#quick-start)
2. [How to contribute a resource](#how-to-contribute-a-resource)
3. [JSON schema](#json-schema)
4. [Approved categories](#approved-categories)
5. [Validate your contribution locally](#validate-your-contribution-locally)
6. [Common mistakes](#common-mistakes)
7. [Project structure](#project-structure)
8. [How it works](#how-it-works)
9. [Scripts](#scripts)

---

## Quick start

You need [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open the address printed in the terminal (usually http://localhost:5173).

---

## How to contribute a resource

You only add **one new JSON file**. You never touch the React code.

1. **Fork and clone** the repository, then create a branch:
   ```bash
   git checkout -b add-my-resource
   ```
2. **Copy the template** [`src/data/resource.template.json`](src/data/resource.template.json) into `src/data/resources/`, naming it after your resource (see [naming](#file-naming)):
   ```bash
   cp src/data/resource.template.json src/data/resources/tailwind-css.json
   ```
3. **Fill in every property** (see the [schema](#json-schema)).
4. **Check it**:
   ```bash
   npm run validate
   ```
   With `npm run dev` running, your resource also appears in the app as soon as you save the file.
5. **Commit, push, and open a pull request**:
   ```bash
   git add src/data/resources/tailwind-css.json
   git commit -m "Add Tailwind CSS resource"
   git push origin add-my-resource
   ```

A GitHub Action re-runs the validation on every pull request, so mistakes are caught before they are merged.

### Copyable template

```json
{
  "id": "your-resource-name",
  "name": "Your Resource Name",
  "description": "One or two sentences explaining what this resource is and why it is useful.",
  "categories": ["Learning Resources"],
  "track": "GLSI",
  "addedBy": "Your Name",
  "url": "https://example.com",
  "imageUrl": "https://cdn.simpleicons.org/github",
  "addedAt": "2026-11-24"
}
```

### File naming

- Put the file in `src/data/resources/` (not in a sub-folder).
- Use **lowercase letters, numbers and hyphens**, ending in `.json`: `mdn-web-docs.json`, `postgresql.json`.
- **The file name must match the `id`**: `id: "mdn-web-docs"` lives in `mdn-web-docs.json`.
- One resource per file.

### Finding a logo (`imageUrl`)

- For most technologies, use [Simple Icons](https://simpleicons.org): `https://cdn.simpleicons.org/<slug>`, for example `https://cdn.simpleicons.org/react` or `https://cdn.simpleicons.org/postgresql`. Look up the slug on the Simple Icons website.
- Otherwise, use a direct link to an image (right-click a logo → *Copy image address*). It should end with something like `.svg` or `.png`.
- If the image fails to load, the app shows a neutral tile with the resource's first letter, so nothing breaks.

---

## JSON schema

| Property      | Type             | Required | Description |
| ------------- | ---------------- | :------: | ----------- |
| `id`          | string           | yes      | Unique identifier. Lowercase letters, numbers and hyphens. Must match the file name. Used in the page address (`#/resources/<id>`). |
| `name`        | string           | yes      | Display name, e.g. `"React"`. |
| `description` | string           | yes      | Short, accurate description (1–2 sentences). |
| `categories`  | array of strings | yes      | **At least one**, each one from the [approved list](#approved-categories). No duplicates. |
| `track`       | string           | yes      | Exactly `"ASR"` or `"GLSI"` (uppercase). The track the resource is most relevant to. |
| `addedBy`     | string           | yes      | Your name or nickname. Resources with the same `addedBy` are grouped on the Contributors page (case-insensitive). |
| `url`         | string           | yes      | The official `http(s)` URL of the resource. |
| `imageUrl`    | string           | yes      | Direct `http(s)` URL of a logo or image. |
| `addedAt`     | string           | no       | The date you added it, as `YYYY-MM-DD`. Used by "Recently added" and "Newest first". If omitted, the resource is treated as *just added*. |

**Academic tracks**

- `ASR`: Administration et Sécurité des Réseaux
- `GLSI`: Génie Logiciel et Systèmes d'Information

---

## Approved categories

A resource can belong to **several** categories, but only these exact values are accepted (case-sensitive). Anything else is rejected.

- `Programming Languages`
- `Frontend`
- `Backend`
- `Mobile Development`
- `Desktop Development`
- `Database`
- `DevOps & Cloud`
- `Cybersecurity`
- `Networking`
- `AI & Machine Learning`
- `Data Science`
- `UI/UX Design`
- `Development Tools`
- `Version Control`
- `Learning Resources`
- `Operating Systems`

```json
"categories": ["Frontend", "Development Tools"]
```

**Rules:** at least one category · each must match the list exactly · no duplicates within a resource · contributors cannot invent new categories. (Maintainers: the list lives in [`src/utils/constants.js`](src/utils/constants.js).)

A multi-category resource appears under each of its categories when filtering, but it is **counted once** in the total number of resources.

---

## Validate your contribution locally

```bash
npm run validate
```

It checks every file in `src/data/resources/` with the **same rules the app uses**, and prints friendly messages:

```
✖ my-resource.json
    error   Unknown category "frontend". Did you mean "Frontend"? Categories must match exactly.
    error   Invalid track "asr". It must be exactly "ASR" or "GLSI" (uppercase).
```

It detects:

- JSON syntax errors (missing quote, trailing comma…)
- missing required properties
- duplicate `id`s
- invalid `track`
- invalid `url` / `imageUrl`
- unknown, empty or duplicated categories

If everything is fine you will see `All good!`. The command exits with an error code otherwise (which is how the GitHub Action blocks a bad pull request).

> **An invalid file never crashes the app.** It is simply skipped. While running `npm run dev`, a red banner at the top of the page lists every skipped file and why. It is hidden in production.

---

## Common mistakes

| Mistake | Fix |
| ------- | --- |
| Trailing comma after the last property | Remove it. JSON does not allow `"a": 1,}` |
| `"category": "Frontend"` | Use the array `"categories": ["Frontend"]` |
| `"track": "asr"` | Must be uppercase: `"ASR"` or `"GLSI"` |
| `"categories": ["frontend"]` | Exact spelling: `"Frontend"` |
| `id` already used by another file | Pick another `id` (and file name) |
| URL without `https://` | Write the complete address: `https://react.dev` |
| File saved as `react.json.txt` or in a sub-folder | It must be `src/data/resources/react.json` |

---

## Project structure

```
src/
├─ components/        Reusable UI pieces (cards, badges, buttons, filters…)
├─ layouts/           Page shell: header, footer, outlet
├─ pages/             One component per screen (Dashboard, Resources, Detail, Contributors)
├─ hooks/             useResources, useResourceFilters, useDocumentTitle
├─ utils/
│  ├─ constants.js          Allowed categories, tracks, sort options
│  ├─ validateResource.js   Validation rules for one resource
│  ├─ resourceCollection.js Parses files, skips invalid ones, detects duplicate ids
│  ├─ loadResources.js      import.meta.glob: automatic file discovery
│  └─ resourceStats.js      Statistics, filtering, sorting
├─ styles/            Design tokens + base CSS (components use CSS Modules)
├─ data/
│  ├─ resources/      ← the JSON files contributors add
│  └─ resource.template.json
├─ App.jsx            Routes
└─ main.jsx           Entry point
scripts/validate-resources.js    `npm run validate`
tests/                           Unit tests (`npm test`)
```

## How it works

- **Discovery.** [`loadResources.js`](src/utils/loadResources.js) uses Vite's `import.meta.glob` with `eager: true` to load every `src/data/resources/*.json` file at build time. Adding a file needs no code change.
- **Why raw text?** The files are imported as text (`?raw`) and parsed with `JSON.parse` inside a `try/catch`. With a plain JSON import, a single syntax error in one contributor's file would break the whole app. This way it becomes a readable validation message instead.
- **Validation.** Every file goes through [`validateResource.js`](src/utils/validateResource.js). Invalid files are skipped; duplicate ids keep the first file (alphabetically).
- **Statistics.** Totals, categories, contributors and track counts are all computed from the loaded data, never hardcoded.
- **Routing.** Hash-based (`/#/resources`), so the built site works on any static host, including GitHub Pages, with no server configuration.
- **Filters live in the URL** (`/#/resources?category=Frontend&track=GLSI`), so a filtered view can be shared or bookmarked.
- **Keyboard.** Press `/` on the Resources page to jump to search; `Esc` clears it.

## Scripts

| Command            | What it does |
| ------------------ | ------------ |
| `npm run dev`      | Start the development server with live reload |
| `npm run validate` | Validate all resource JSON files |
| `npm test`         | Run the unit tests (validation and statistics) |
| `npm run build`    | Create the production build in `dist/` |
| `npm run preview`  | Preview the production build locally |

The demonstration resources in `src/data/resources/` (React, Vue.js, Django, GitHub, Figma, Python, PostgreSQL, MDN Web Docs) are ordinary data files. Keep, edit or delete them freely.

## Tech stack

React · Vite · JavaScript · CSS Modules · [Lucide](https://lucide.dev) icons · React Router
