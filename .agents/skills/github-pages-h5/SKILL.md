---
name: github-pages-h5
description: Use this skill when preparing a static HTML, CSS, and JavaScript app for GitHub Pages deployment, direct browser opening, and mobile H5 usage without backend services.
---

# GitHub Pages H5 Skill

This skill is used to prepare a static front-end app for GitHub Pages and mobile browser access.

The project should be simple, fast, portable, and easy to deploy.

## Core technical rules

- Use plain HTML, CSS, and JavaScript unless explicitly requested otherwise.
- No backend.
- No login.
- No build step required.
- No npm install required.
- No external CDN dependencies.
- No external analytics.
- No network requests.
- Use relative paths only.
- Ensure `index.html` works when opened directly.
- Ensure the same app works on GitHub Pages.

## Recommended project structure

```txt
/
├── index.html
├── styles.css
├── app.js
├── data/
│   └── questions.js
├── README.md
└── AGENTS.md
````

For skills:

```txt
/
└── .agents/
    └── skills/
        ├── quiet-study-ui/
        │   └── SKILL.md
        ├── local-question-bank/
        │   └── SKILL.md
        └── github-pages-h5/
            └── SKILL.md
```

## Path rules

Use relative paths:

```html
<link rel="stylesheet" href="./styles.css">
<script src="./data/questions.js"></script>
<script src="./app.js"></script>
```

Avoid absolute paths:

```html
<link rel="stylesheet" href="/styles.css">
<script src="/app.js"></script>
```

Absolute paths may break on GitHub Pages project sites.

## Mobile rules

The app must work well on phone browsers.

Requirements:

* Mobile-first layout
* Responsive design
* Touch-friendly buttons
* Minimum comfortable tap size
* Readable text
* No hover-only actions
* No horizontal overflow
* Works in portrait mode
* Works on common mobile browsers

Recommended viewport:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Performance rules

* Keep files lightweight.
* Avoid large dependencies.
* Avoid complex animations.
* Avoid unnecessary images.
* Prefer CSS-based layouts.
* Keep JavaScript readable and modular.

## Browser compatibility

Use broadly supported JavaScript.

Avoid advanced syntax if unnecessary.

Recommended:

* `const` / `let`
* arrow functions are acceptable
* `querySelector`
* `addEventListener`
* `localStorage`
* `JSON.parse`
* `JSON.stringify`

Avoid:

* framework-specific code
* TypeScript unless explicitly requested
* bundler-only features
* server-side APIs

## GitHub Pages deployment README

README.md must include:

1. Project introduction
2. Local preview method
3. GitHub upload method
4. GitHub Pages setup
5. How to update question data
6. How to import JSON data
7. How localStorage records work
8. How to reset local records

Recommended GitHub Pages instructions:

```md
## Deploy to GitHub Pages

1. Push this project to a GitHub repository.
2. Open the repository on GitHub.
3. Go to Settings.
4. Open Pages.
5. Under Build and deployment, choose Deploy from a branch.
6. Select the main branch and root folder.
7. Save.
8. Open the generated GitHub Pages URL.
```

## Testing checklist

After changes, verify:

* `index.html` opens directly in a browser.
* CSS loads correctly.
* JavaScript loads correctly.
* Navigation works.
* Question data loads.
* localStorage saves progress.
* Refreshing the page keeps records.
* Mobile layout is usable.
* No console errors.
* GitHub Pages paths are relative.
* README is updated if deployment behavior changes.

## Output expectations

When preparing or modifying the project:

1. Keep it static.
2. Keep it deployable to GitHub Pages.
3. Keep it usable on mobile.
4. Do not add build tools unless explicitly requested.
5. Do not introduce external network dependencies.
6. Verify all paths are relative.

````
