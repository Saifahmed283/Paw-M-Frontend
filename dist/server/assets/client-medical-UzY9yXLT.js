import { t as api } from "./api-CC0Gwk-u.js";
//#region src/lib/client-medical.ts
async function getMyProfile() {
	return api.get("/me");
}
async function getPets() {
	return api.get("/pets");
}
async function createPet(input) {
	return api.post("/pets", input);
}
async function deletePet(id) {
	await api.delete(`/pets/${id}`);
}
async function getPetHistory(id) {
	return api.get(`/pets/${id}/history`);
}
async function getPrescription(id) {
	return api.get(`/prescriptions/${id}`);
}
async function listPrescriptions(params) {
	const q = new URLSearchParams();
	if (params?.petId) q.set("petId", params.petId);
	if (params?.status) q.set("status", params.status);
	return api.get(`/prescriptions${q.size ? `?${q.toString()}` : ""}`);
}
async function createPrescription(input) {
	return api.post("/prescriptions", input);
}
async function updatePrescription(id, patch) {
	return api.patch(`/prescriptions/${id}`, patch);
}
async function verifyRxCode(code) {
	return api.get(`/prescriptions/verify?code=${encodeURIComponent(code)}`);
}
async function saveBookingClinical(id, patch) {
	return api.patch(`/bookings/${id}/clinical`, patch);
}
//#endregion
export { getPetHistory as a, listPrescriptions as c, verifyRxCode as d, getMyProfile as i, saveBookingClinical as l, createPrescription as n, getPets as o, deletePet as r, getPrescription as s, createPet as t, updatePrescription as u };
