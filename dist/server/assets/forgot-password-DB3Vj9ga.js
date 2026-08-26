import { p as useI18n, t as api, u as Button } from "./api-D7PYCafN.js";
import { t as Input } from "./input-D1zsAZ_w.js";
import { t as Label } from "./label-DDmdBrZB.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-B9I9hgYt.js";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/forgot-password.tsx?tsr-split=component
function ForgotPasswordPage() {
	const { t } = useI18n();
	const [username, setUsername] = useState("");
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post("/auth/forgot-password", { username });
			setSent(true);
		} catch {
			setSent(true);
		} finally {
			setLoading(false);
		}
	}
	if (sent) return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "text-center",
				children: [/* @__PURE__ */ jsx(CardTitle, { children: t("auth.resetCodeSent") }), /* @__PURE__ */ jsx(CardDescription, { children: t("auth.resetCodeSentDesc") })]
			}), /* @__PURE__ */ jsx(CardContent, {
				className: "text-center",
				children: /* @__PURE__ */ jsx(Link, {
					to: "/reset-password",
					className: "text-primary underline",
					children: t("auth.goToReset")
				})
			})]
		})
	});
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "text-center",
				children: [/* @__PURE__ */ jsx(CardTitle, { children: t("auth.forgotPassword") }), /* @__PURE__ */ jsx(CardDescription, { children: t("auth.forgotPasswordDesc") })]
			}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ jsx(Label, {
						htmlFor: "username",
						children: t("auth.username")
					}), /* @__PURE__ */ jsx(Input, {
						id: "username",
						value: username,
						onChange: (e) => setUsername(e.target.value),
						required: true
					})]
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					className: "w-full",
					disabled: loading,
					children: loading ? t("auth.sending") : t("auth.sendResetCode")
				})]
			}) })]
		})
	});
}
//#endregion
export { ForgotPasswordPage as component };
