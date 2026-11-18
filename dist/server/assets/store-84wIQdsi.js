import { Outlet } from "@tanstack/react-router";
import { jsx } from "react/jsx-runtime";
// src/routes/store.tsx?tsr-split=component
/**
* Layout route for /store/* pages. Renders nothing itself — the index page
* (store.index.tsx) is the catalog and /store/checkout, /store/track and
* /store/$productId are sibling pages rendered in place of it.
*/
function StoreLayout() {
	return /* @__PURE__ */ jsx(Outlet, {});
}
export { StoreLayout as component };
