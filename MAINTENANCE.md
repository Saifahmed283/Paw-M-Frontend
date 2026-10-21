# Maintenance mode (paused site)

The clinic site is currently paused. While it is paused, the frontend serves the
under-construction page on **every** route instead of the real pages.

## Where things live

| Path                                     | What it is                                                       |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `public/maintenance/index.html`          | The under-construction page (your markup)                         |
| `public/maintenance/styles.css`          | The page's stylesheet                                             |
| `nginx.maintenance.conf`                 | nginx config used while the site is paused                        |
| `nginx.conf`                             | The normal nginx config (the real site)                           |
| `Dockerfile` (`ARG MAINTENANCE`)         | Chooses which of the two configs gets baked into the image        |

The page **must not** live at `public/index.html`: Vite copies `public/` into the
build output *before* the router prerenders, and the prerendered home page then
overwrites it. A `public/index.html` is silently dropped by the build.

## Pause / resume

The switch is the `MAINTENANCE` build argument in the `Dockerfile`:

```dockerfile
ARG MAINTENANCE=true    # paused  -> under-construction page on every route
ARG MAINTENANCE=false   # live    -> the real site
```

* **Pause** (current state): build with `MAINTENANCE=true` (the default) and
  redeploy the frontend.
* **Resume**: build with `--build-arg MAINTENANCE=false` (or change the default
  in the `Dockerfile` to `false`), rebuild and redeploy. Nothing else to undo -
  the React app, its routes and its content were never touched.

## How the page is served

`nginx.maintenance.conf` answers every page request with a **503 + Retry-After**
and the under-construction page as the body.

503 is deliberate: search engines treat it as a temporary outage, so the clinic's
pages stay in the index (flagged as "temporarily unavailable") instead of being
replaced by the maintenance copy or dropped from the index entirely. If a CDN in
front of the server replaces 5xx bodies with its own error page, change the
`return 503;` in `nginx.maintenance.conf` to `return 200;` - but then the
maintenance copy becomes indexable, so keep the `noindex` meta tag on the page.

`robots.txt`, `sitemap.xml`, `llms.txt` and the favicons are still served
normally, so crawlers keep working while the pages themselves are paused.

## Editing the page

`public/maintenance/index.html` and `public/maintenance/styles.css` are plain
static files - no build step, no React. Edit them and redeploy.

To show a live "back in X min" countdown, set the expected return time on the
`<body>` tag:

```html
<body data-eta="2026-10-21T22:00:00+03:00">
```

## Checking it locally

```bash
npm run build
npx serve dist/client   # or: npm run preview
```

`npm run dev` still runs the **real** site - the paused page is a production
concern only.
