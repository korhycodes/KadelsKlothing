# Kadels Klothing

A responsive React storefront and founder profile for Kadels Klothing, built with Vite.

## Run locally

Install dependencies, then start the development server:

```bash
npm install
npm run dev
```

Vite prints a local URL in the terminal. Open that URL to view the storefront.

## Build and preview

```bash
npm run build
npm run preview
```

The production site is written to `dist/`. The Vite configuration includes both `index.html` and `founder.html` as build entries and copies the required `assets/` files into `dist/assets/`.

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds the site and publishes only `dist/` whenever you push to `main`.

1. Create a GitHub repository and, under **Settings → Pages**, set the source to **GitHub Actions**.
2. Open Git Bash in this project folder and run:

   ```bash
   cd "/c/Users/Kobby/Desktop/Kadels Klothing Website"
   npm ci
   npm run build
   git init -b main
   git add .
   git status --short --ignored
   git diff --cached --stat
   git commit -m "Prepare Kadels Klothing for GitHub Pages"
   git remote add origin https://github.com/<USERNAME>/<REPOSITORY>.git
   git push -u origin main
   ```

   Replace `<USERNAME>` and `<REPOSITORY>` with your GitHub account and repository. `git init -b main` is a one-time step for this folder.
3. The workflow deploys on each push to `main`. Check **Actions** in GitHub for its status and **Settings → Pages** for the published URL.

`.gitignore` excludes `node_modules/` and `dist/` from Git commits. Git ignore rules do not filter a deployment artifact; the workflow creates `dist/` and deploys it. The unused catalog media has been removed from `assets/`, while the remaining product videos, posters, and page images are included in the build.

## Pages and features

- **Storefront (`index.html`)** — responsive product catalog with category filters, sorting, separate photo and video listings, cart, checkout request form, and custom-measurement guide.
- **Founder profile (`founder.html`)** — founder story, supplied profile and stage photos, personal social links, and embedded YouTube music release.
- **Studio** — open it with the **Studio** button in the storefront header. It provides local product, order-request, and custom-request management.
- Product and order changes are stored in the browser's `localStorage`. Video previews are muted, and the requested product removals are applied in the catalog.

## Project layout

```text
index.html                 Storefront HTML entry
founder.html               Founder profile HTML entry
src/
  App.jsx                  Storefront, cart, forms, and Studio
  FounderPage.jsx          Founder profile page
  SocialLinks.jsx          Brand and founder social links
  catalog.js               Starter products and local storage helpers
  main.jsx                 React entry point and stylesheet import
assets/                    Product photos, videos, posters, and profile images
styles.css                 Responsive site styles
vite.config.js             React plugin and multi-page production build
```

## Important limitation

Studio is currently a browser-local preview, not a secure admin portal. It has no administrator authentication or shared database, so changes are available only in the browser where they were made. Supabase has not been configured, and the order form does not process payments.
