# School Entry Calculator

A simple web app for British school admissions staff and parents. Enter a child's date of birth to see:

- Their academic cohort (1 September – 31 August)
- Their first point of entry (Reception)
- The next upcoming entry point from Reception through Year 8
- A full schedule of entry years for every year group

Built with [Vite](https://vitejs.dev/) and TypeScript.

## How it works

England groups children by academic year running **1 September to 31 August**. Children normally start **Reception** in the **September of the calendar year they turn four**, then progress one year group each September.

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

After merging to `main`:

1. Open the repo **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually)

The workflow in `.github/workflows/deploy.yml` builds the app and publishes `dist/` automatically.

## Tests

```bash
npm test
```
