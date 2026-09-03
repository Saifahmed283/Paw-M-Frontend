import { _ as useI18n, d as Button, t as api } from "./api-BJGmlh-v.js";
import { t as Input } from "./input-D_ZXjIgM.js";
import { t as Label } from "./label-kb8hgorA.js";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-xvryhJXm.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/reset-password.tsx?tsr-split=component
function ResetPasswordPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		try {
			await api.post("/auth/reset-password", {
				username,
				code,
				newPassword: password
			});
			toast.success(t("auth.passwordReset"));
			navigate({ to: "/dashboard" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "";
			toast.error(message || t("auth.resetFailed"));
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs(Card, {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ jsxs(CardHeader, {
				className: "text-center",
				children: [/* @__PURE__ */ jsx(CardTitle, { children: t("auth.resetPassword") }), /* @__PURE__ */ jsx(CardDescription, { children: t("auth.resetPasswordDesc") })]
			}), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
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
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "code",
							children: t("auth.resetCode")
						}), /* @__PURE__ */ jsx(Input, {
							id: "code",
							value: code,
							onChange: (e) => setCode(e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsx(Label, {
							htmlFor: "password",
							children: t("auth.newPassword")
						}), /* @__PURE__ */ jsx(Input, {
							id: "password",
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							required: true,
							minLength: 6
						})]
					}),
					/* @__PURE__ */ jsx(Button, {
						type: "submit",
						className: "w-full",
						disabled: loading,
						children: loading ? t("auth.resetting") : t("auth.resetPassword")
					})
				]
			}) })]
		})
	});
}
//#endregion
export { ResetPasswordPage as component };
