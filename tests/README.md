# Paw-M Playwright E2E Tests

Comprehensive end-to-end tests for the Paw-M Veterinary Clinic dashboard.

## Test Structure

```
tests/
├── auth/                    # Authentication & authorization tests
│   ├── login.spec.ts       # Login, logout, session persistence
│   └── role-access.spec.ts # Role-based tab access (staff/payroll/admin)
├── dashboard/              # Core dashboard tab tests (read-only)
│   ├── overview.spec.ts    # Stats, today's appointments, recent activity
│   ├── requests.spec.ts    # Booking requests table, filters, actions
│   ├── reservations.spec.ts# Confirmed bookings, dialogs
│   └── shift-banner.spec.ts# Check-in/out, live status
├── data-mutation/          # Tests that create/modify data (isolated fixtures)
│   └── booking-crud.spec.ts# Full booking lifecycle: create→confirm→complete→archive→delete
├── cross-cutting/          # Cross-cutting concerns
│   ├── i18n.spec.ts        # EN/AR translation, RTL layout
│   ├── responsive.spec.ts  # Mobile, tablet, desktop layouts
│   ├── a11y.spec.ts        # Accessibility (axe-core)
│   └── error-handling.spec.ts # Network errors, 401, 429, 500, empty states
├── fixtures/               # Test data management
│   ├── api-helpers.ts      # Backend API helpers
│   ├── test-data.ts        # Playwright fixtures with auto-cleanup
│   └── test-data.ts        # Test data seeding
├── utils/                  # Shared utilities
│   └── selectors.ts        # Stable test selectors
├── global-setup.ts         # Creates test users, saves auth states
├── global-teardown.ts      # Cleans up test data
└── README.md               # This file
```

## Running Tests

### Local Development

```bash
# Install dependencies (first time only)
cd Paw-M-Frontend
npm install

# Install Playwright browsers (first time only)
npx playwright install chromium

# Start both frontend and backend dev servers
# Terminal 1: Backend
cd Paw-M-Backend
npm run dev

# Terminal 2: Frontend
cd Paw-M-Frontend
npm run dev

# Terminal 3: Run tests
cd Paw-M-Frontend
npm run test:e2e          # Headless (CI mode)
npm run test:e2e:headed   # Headed (see browser)
npm run test:e2e:ui       # Playwright UI mode
npm run test:e2e:debug    # Debug mode
npm run test:e2e:mobile   # Mobile viewport tests
npm run test:all          # Run vitest + playwright
```

### Test Data Isolation

Tests **never touch production data**:

1. **Environment**: Runs against local dev servers (`localhost:3000` + `localhost:3001`)
2. **Test Accounts**: Created dynamically via API in `global-setup.ts`
3. **Fixtures**: Each test gets unique data with UUID prefixes (`TEST-REQ-{timestamp}`)
4. **Cleanup**: Automatic in `afterEach` + `global-teardown.ts`
5. **Auth**: Uses `storageState` per role (staff/payroll/admin) - no repeated login

### Adding Test IDs to Components

For stable selectors, add `data-testid` attributes to components:

```tsx
// In dashboard components
<TableRow data-testid={`booking-row-${r.id}`}>
<Button data-testid={`confirm-btn-${r.id}`}>Confirm</Button>
<Dialog data-testid="clinical-record-dialog">
<button data-testid="check-in-btn">Check In</button>
<nav data-testid="dashboard-sidebar">
```

Then update `tests/utils/selectors.ts` to use these IDs.

## Test Coverage

| Area | Tests | Coverage |
|------|-------|----------|
| Authentication | 8 | Login, logout, roles, session |
| Dashboard Tabs | 40 | All 17 tabs, filters, actions |
| Booking Lifecycle | 12 | CRUD + status transitions |
| i18n (EN/AR) | 8 | Translation, RTL, formatting |
| Responsive | 12 | Mobile, tablet, desktop |
| Accessibility | 12 | axe-core, headings, focus, contrast |
| Error Handling | 10 | Network, 401, 429, 500, empty states |

## CI/CD

GitHub Actions workflow: `.github/workflows/playwright.yml`

Runs on:
- Push to main/develop
- Pull requests to main/develop

Artifacts uploaded:
- HTML report (`playwright-report/`)
- JSON/XML results
- Traces on failure

## Debugging Failures

1. **Local**: Run `npm run test:e2e:headed` to see browser
2. **UI Mode**: Run `npm run test:e2e:ui` for interactive debugging
3. **Traces**: Open `trace.zip` from artifacts in Playwright Trace Viewer
4. **Screenshots**: Saved on failure in `test-results/`
5. **Videos**: Saved on failure in `test-results/`

## Writing New Tests

1. Create spec file in appropriate directory
2. Use fixtures from `tests/fixtures/test-data.ts` for data mutation tests
3. Use selectors from `tests/utils/selectors.ts`
4. Follow pattern: `test.describe` → `test.beforeEach` → `test`
5. Always clean up test data (fixtures handle this automatically)
6. Add `data-testid` to components for new UI elements

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend not ready | Increase wait time in `global-setup.ts` |
| Auth state missing | Run `global-setup.ts` manually or check test users exist |
| Flaky tests | Add `await page.waitForLoadState('networkidle')` |
| Mobile tests fail | Check viewport settings in `playwright.config.ts` |
| Arabic text not rendering | Ensure fonts support Arabic characters |