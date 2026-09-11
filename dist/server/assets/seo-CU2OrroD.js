//#region src/lib/seo.ts
var SITE_URL = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/"
}["VITE_SITE_URL"] || "https://pawmclinnic.com";
function withSiteUrl(path) {
	if (/^https?:\/\//.test(path)) return path;
	return `${SITE_URL}${path}`;
}
function ogMeta(title, description, path) {
	const url = withSiteUrl(path);
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:url",
			content: url
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			property: "og:image",
			content: `${SITE_URL}/og-image.png`
		},
		{
			property: "og:locale",
			content: "en_US"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{
			name: "twitter:title",
			content: title
		},
		{
			name: "twitter:description",
			content: description
		},
		{
			name: "twitter:image",
			content: `${SITE_URL}/og-image.png`
		}
	];
}
//#endregion
export { ogMeta as n, withSiteUrl as r, SITE_URL as t };
