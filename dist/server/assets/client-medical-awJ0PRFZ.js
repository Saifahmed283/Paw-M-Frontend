import { e as api } from "./router-bUAwJbNn.js";
async function markNotificationRead(id) {
  return api.patch(`/me/notifications/${id}/read`);
}
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
export {
  getMyProfile as a,
  createPet as b,
  createPrescription as c,
  deletePet as d,
  getPrescription as e,
  getPetHistory as f,
  getPets as g,
  listPrescriptions as l,
  markNotificationRead as m,
  saveBookingClinical as s,
  updatePrescription as u,
  verifyRxCode as v
};
