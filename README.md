# Devfinder - GitHub User Search App

A solution to the [GitHub user search app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/github-user-search-app-Q09YOgaH6).

## Overview

### The challenge

- Search for GitHub users by username
- Display relevant user info from the GitHub API
- Switch between light and dark themes manually
- Auto-detect the OS colour scheme on first load
- Responsive layout across all screen sizes
- Hover states on all interactive elements

### Screenshot

![](./preview.jpg)

## Running locally

No build step needed — just open `index.html` in a browser, or serve it with any static server:

```bash
npx serve .
# or
python3 -m http.server
```

## Built with

- Semantic HTML5
- CSS custom properties (design tokens for both themes)
- Flexbox & CSS Grid
- Mobile-first responsive layout
- Vanilla JavaScript (ES6+) — no frameworks or libraries
- GitHub Users API (`https://api.github.com/users/{username}`)

## What I learned

### `prefers-color-scheme` — reading the OS/browser theme

Browsers expose the user's OS-level or browser/user agent's colour preference through the CSS media feature `prefers-color-scheme`. You can read it in JavaScript at runtime using `window.matchMedia`:

```js
const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';
```

This runs once on page load to pick the right default theme before the user has made any manual choice. If they've toggled the theme before, the saved `localStorage` value takes priority.

### `dataset` and `data-*` attributes

HTML elements support arbitrary `data-*` attributes (e.g. `data-theme="dark"`). In JavaScript these are exposed through the element's `.dataset` property — a `DOMStringMap` that maps each attribute name (camelCased, without the `data-` prefix) to its current value.

**Key behaviour:** the `dataset` object itself is read-only — you can't replace it — but you can freely read and write the individual properties on it, and each write immediately updates the corresponding attribute in the DOM:

```js
// Read
console.log(document.body.dataset.theme); // "light"

// Write — updates data-theme="dark" in the HTML
document.body.dataset.theme = 'dark';

// This would throw — dataset itself is read-only
// document.body.dataset = {}; ❌
```

In this project, the entire theming system hangs off `data-theme` on `<body>`. CSS selects `[data-theme="dark"]` to swap every custom property in one place, so no style rules are duplicated.


