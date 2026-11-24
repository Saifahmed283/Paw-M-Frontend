// Playwright storageState stores cookies and localStorage, but not
// sessionStorage. The app keeps its staff session in sessionStorage, so every
// project seeds it from a readable cookie written by global setup.
(() => {
  const name = "paw-m-test-session";
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!entry) return;

  try {
    const session = JSON.parse(decodeURIComponent(entry.slice(name.length + 1)));
    if (!session || !session.token || !session.username) return;
    sessionStorage.setItem(
      "paw-m:admin-session",
      JSON.stringify({
        username: session.username,
        role: session.role || "staff",
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        token: session.token,
      }),
    );
  } catch {
    // A malformed test cookie must not break the page; tests will fail on auth.
  }
})();
