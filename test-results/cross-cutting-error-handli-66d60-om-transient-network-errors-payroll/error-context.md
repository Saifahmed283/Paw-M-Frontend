# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-cutting\error-handling.spec.ts >> Error Handling >> should recover from transient network errors
- Location: tests\cross-cutting\error-handling.spec.ts:162:3

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') to be visible

```

```
Error: browserContext.close: Test ended.
Browser logs:

<launching> C:\Users\saifahmed\AppData\Local\ms-playwright\chromium_headless_shell-1255\chrome-headless-shell-win64\chrome-headless-shell.exe --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-edgeupdater --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,DestroyProfileOnBrowserClose,HttpsUpgrades,HttpsFirstBalancedModeAutoEnable,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,AvoidCorsURLLoaderRestartOnRedirect,TcpPortRandomizationWin,OptimizationHints,NetworkTimeServiceQuerying,AimEnabled,PreconnectToSearch,msForceBrowserSignIn,msEdgeUpdateLaunchServicesPreferredVersion --enable-features=CDPScreenshotNewSurface,SkipListAccountsWithoutGaiaCookies --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --disable-updater-scheduler --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --enable-unsafe-swiftshader --edge-skip-compat-layer-relaunch --disable-stack-profiler --disable-infobars --disable-sync --do-not-de-elevate --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=C:\Users\SAIFAH~1\AppData\Local\Temp\playwright_chromiumdev_profile-wQGH2a --remote-debugging-pipe --no-startup-window
<launched> pid=21468
[pid=21468][err] [1124/165625.889:INFO:CONSOLE:855] "[vite] connecting...", source: http://localhost:5173/@vite/client (855)
[pid=21468][err] [1124/165625.948:INFO:CONSOLE:964] "[vite] connected.", source: http://localhost:5173/@vite/client (964)
[pid=21468][err] [1124/165627.957:INFO:CONSOLE:15803] "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold", source: http://localhost:5173/node_modules/.vite/deps/react-dom_client.js?v=47f7d26a (15803)
```