# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: cross-cutting\error-handling.spec.ts >> Error Handling >> should handle form validation errors
- Location: tests\cross-cutting\error-handling.spec.ts:118:3

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[data-testid="dashboard-sidebar"], aside.bg-\\[var\\(--navy-900\\)\\]') to be visible

```

```
Error: browserContext.close: Protocol error (Target.disposeBrowserContext): Failed to find context with id 7C719C1FF057A7990ACB9C4F8CCD9805
```