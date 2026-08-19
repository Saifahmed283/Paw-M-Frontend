//#region src/lib/storage.ts
/**
* Safe localStorage / sessionStorage accessors that never throw.
* Storage can be unavailable (private mode, sandboxed iframes, SSR), so every
* read/write is wrapped in try/catch.
*/
function storage(kind) {
	try {
		return kind === "local" ? window.localStorage : window.sessionStorage;
	} catch {
		return null;
	}
}
function storageGet(kind, key) {
	try {
		return storage(kind)?.getItem(key) ?? null;
	} catch {
		return null;
	}
}
function storageSet(kind, key, value) {
	try {
		storage(kind)?.setItem(key, value);
	} catch {}
}
function storageRemove(kind, key) {
	try {
		storage(kind)?.removeItem(key);
	} catch {}
}
//#endregion
export { storageRemove as n, storageSet as r, storageGet as t };
