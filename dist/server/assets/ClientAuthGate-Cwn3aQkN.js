import { J as verifyClientEmail, K as loginClient, W as clientIsAuthed, q as requestClientVerification, ut as Button } from "./clinic-store-Dc-Lo-AL.js";
import { t as Input } from "./input-hqsDskb7.js";
import { t as Label } from "./label-bSTize7O.js";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, LockKeyhole, MailCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
//#region src/components/ClientAuthGate.tsx
function ClientAuthGate({ children }) {
	const [authed, setAuthed] = useState(clientIsAuthed);
	const [registering, setRegistering] = useState(false);
	const [verification, setVerification] = useState(false);
	const [busy, setBusy] = useState(false);
	const [form, setForm] = useState({
		fullName: "",
		email: "",
		phone: "",
		password: "",
		code: ""
	});
	if (authed) return children;
	const submit = async (event) => {
		event.preventDefault();
		setBusy(true);
		try {
			if (verification) {
				await verifyClientEmail(form.email, form.code);
				setAuthed(true);
				toast.success("Email verified. Your account is ready.");
			} else if (registering) {
				await requestClientVerification(form);
				setVerification(true);
				toast.success("Verification code sent to your email.");
			} else {
				await loginClient(form.email, form.password);
				setAuthed(true);
				toast.success("Signed in successfully");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Could not sign in");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ jsx("section", {
		className: "hero-gradient flex min-h-screen items-center justify-center px-5 py-32",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: submit,
			className: "w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary",
						children: verification ? /* @__PURE__ */ jsx(MailCheck, { className: "size-6" }) : registering ? /* @__PURE__ */ jsx(ShieldCheck, { className: "size-6" }) : /* @__PURE__ */ jsx(LockKeyhole, { className: "size-6" })
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-primary",
						children: "Paw Clinic Madinaty"
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-2xl font-bold",
						children: verification ? "Verify your email" : registering ? "Create your account" : "Welcome back"
					})] })]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: verification ? `Enter the six-digit code sent to ${form.email}.` : "Your account keeps appointments, orders, and activity together."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 grid gap-4",
					children: [
						verification ? /* @__PURE__ */ jsxs(Label, { children: ["Verification code", /* @__PURE__ */ jsx(Input, {
							required: true,
							inputMode: "numeric",
							pattern: "[0-9]{6}",
							maxLength: 6,
							autoComplete: "one-time-code",
							value: form.code,
							onChange: (e) => setForm({
								...form,
								code: e.target.value.replace(/\D/g, "")
							})
						})] }) : registering ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs(Label, { children: ["Full name", /* @__PURE__ */ jsx(Input, {
							required: true,
							value: form.fullName,
							onChange: (e) => setForm({
								...form,
								fullName: e.target.value
							})
						})] }), /* @__PURE__ */ jsxs(Label, { children: ["Phone", /* @__PURE__ */ jsx(Input, {
							required: true,
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							})
						})] })] }) : null,
						!verification && /* @__PURE__ */ jsxs(Label, { children: ["Email", /* @__PURE__ */ jsx(Input, {
							required: true,
							type: "email",
							autoComplete: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							})
						})] }),
						!verification && /* @__PURE__ */ jsxs(Label, { children: ["Password", /* @__PURE__ */ jsx(Input, {
							required: true,
							type: "password",
							minLength: 8,
							autoComplete: registering ? "new-password" : "current-password",
							value: form.password,
							onChange: (e) => setForm({
								...form,
								password: e.target.value
							})
						})] }),
						/* @__PURE__ */ jsxs(Button, {
							type: "submit",
							disabled: busy,
							children: [busy ? "Please wait..." : verification ? "Verify and continue" : registering ? "Create account" : "Sign in", /* @__PURE__ */ jsx(ArrowRight, { className: "size-4" })]
						}),
						verification ? /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setVerification(false),
							children: "Use a different email"
						}) : /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setRegistering(!registering),
							children: registering ? "Already have an account? Sign in" : "New client? Create an account"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ClientAuthGate as t };
