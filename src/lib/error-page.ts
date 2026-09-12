export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Something went wrong — Paw-M Veterinary Clinic</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #f7f8f6; color: #111827; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      .mark { width: 3rem; height: 3rem; margin: 0 auto 1rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.5rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #5f8b6c; color: #fff; }
      .secondary { background: #fff; color: #111827; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <svg class="mark" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M4 42h9l5-11 6 20 5-15 4 6h6" stroke="#5f8b6c" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        <g fill="#5f8b6c"><ellipse cx="43.5" cy="20" rx="3.1" ry="4.2"/><ellipse cx="52" cy="16.5" rx="3.1" ry="4.4"/><ellipse cx="60" cy="21" rx="2.9" ry="4"/><path d="M45 34.5c0-4.6 3.4-8 7.5-8s7.5 3.4 7.5 8c0 4.2-3.1 6.6-7.5 6.6S45 38.7 45 34.5Z"/></g>
      </svg>
      <h1>Something went wrong at Paw-M</h1>
      <p>We hit an unexpected issue on our end. Try refreshing, or head back to the homepage.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
        <a class="secondary" href="tel:+201210105624">Call the clinic</a>
      </div>
    </div>
  </body>
</html>`;
}
