# School Entry Calculator

A simple web app for British school admissions staff and parents. Enter a child's date of birth to see:

- Their academic cohort (1 September – 31 August)
- Their first point of entry (Pre-nursery)
- The next upcoming entry point from Pre-nursery through Year 8
- A full schedule of entry years for every year group

Built with [Vite](https://vitejs.dev/) and TypeScript.

## How it works

England groups children by academic year running **1 September to 31 August**. Children normally enter **Pre-nursery** in the **September after they turn two**, **Nursery** in the **September they turn three**, and **Reception** in the **September they turn four**, then progress one year group each September.

This matches [GOV.UK guidance on school starting age](https://www.gov.uk/schools-admissions/school-starting-age). Summer-born deferral rules are not included.

## Development

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

The production build is written to `dist/` and can be hosted on any static file host.

## GitHub Pages

Yes — this app works on GitHub Pages. The Vite config uses `base: '/c-calc/'` so assets load correctly from a project site URL like `https://nimothy.github.io/c-calc/`.

### One-time setup

1. Open the repo **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**
3. Choose branch **`gh-pages`** and folder **`/ (root)`**

### Production deploys

Pushes to `main` run `.github/workflows/deploy.yml` and publish the live site.

You can also run **Deploy to GitHub Pages** manually from the Actions tab.

### PR previews

Every pull request automatically deploys a preview to:

`https://<your-username>.github.io/c-calc/preview/pr-<number>/`

The workflow posts (or updates) a comment on the PR with the preview link. When the PR is closed, the preview folder is removed from `gh-pages`.

## Tests

```bash
npm test
```
