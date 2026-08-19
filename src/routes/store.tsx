import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for /store/* pages. Renders nothing itself — the index page
 * (store.index.tsx) is the catalog and /store/checkout, /store/track and
 * /store/$productId are sibling pages rendered in place of it.
 */
export const Route = createFileRoute("/store")({
  component: StoreLayout,
});

function StoreLayout() {
  return <Outlet />;
}
